'use strict';

const BbPromise = require('bluebird');
const Botkit = require('botkit');
const BotkitStorage = require('botkit-storage-mongo');
const _ = require('lodash');
const slack = require('../../config/slack');
const SlackConversation = require('./SlackConversation');
const rp = require('request-promise');
const mongoose = require('mongoose');

class Slack {
  constructor(davis) {
    this.logger = davis.logger;
    this.bots = {};
    this.davisChannels = [];
    this.users = {};
    this.pluginManager = davis.pluginManager;
    this.event = davis.event;
    this.Exchange = davis.classes.Exchange;
    this.started = false;
    this.sharedStorage = {};

    this.davis = davis;
    this.utils = davis.utils.Slack;
  }

  start(isRest) {
    if (this.started) {
      this.logger.info('Slack is already running');
      return BbPromise.resolve('Slack has already been started.');
    }

    // Stop initialization if missing Slack App settings
    return BbPromise.try(() => {
      if (!this.davis.config.isSlackEnabled()) {
        throw new this.davis.classes.Error('Slack is disabled.');
      } else if (this.davis.config.getSlackClientId() === '') {
        throw new this.davis.classes.Error('Slack Client ID is missing.');
      } else if (this.davis.config.getSlackClientSecret() === '') {
        throw new this.davis.classes.Error('Slack Client Secret is missing.');
      } else if (this.davis.config.getSlackRedirectUri() === '') {
        throw new this.davis.classes.Error('Slack Redirect URI is missing.');
      }

      this.controller = Botkit.slackbot({
        debug: process.env.SLACK_DEBUG || false,
        interactive_replies: true,
        logger: this.davis.logger.botkit,
        stats_optout: true,
        storage: BotkitStorage({ mongoUri: `${this.davis.config.getMongoDBConnectionString()}-botkit` }),
      }).configureSlackApp({
        clientId: this.davis.config.getSlackClientId(),
        clientSecret: this.davis.config.getSlackClientSecret(),
        redirectUri: this.davis.config.getSlackRedirectUri(),
        scopes: [
          'incoming-webhook', 'team:read', 'users:read', 'users:read.email',
          'channels:read', 'im:read', 'im:write',
          'groups:read', 'emoji:read', 'chat:write:bot',
        ],
      });

      this.controller.config.port = this.davis.config.getDavisPort();
      this.controller.webserver = this.davis.server.app;

      // Set up web endpoints for oauth, receiving webhooks
      this.controller
        .createOauthEndpoints(this.controller.webserver, (err, req, res) => this.oauthErrors(err, req, res))
        .createWebhookEndpoints(this.controller.webserver);

      // Registering Slack Event handlers

      // @davis or direct message
      this.controller.hears(['(.*)'], 'direct_mention,direct_message', (bot, message) => this.respondToDirectMessage(bot, message));

      // hey davis
      this.controller.hears(slack.PHRASES, 'mention,ambient', (bot, message) => this.respondToAmbientMessages(bot, message));

      // A user has joined a group, say hello
      this.controller.on('group_joined', (bot, message) => this.userJoinedGroup(bot, message));

      // A user has joined a channel, say hello
      this.controller.on('channel_joined', (bot, message) => this.userJoinedChannel(bot, message));

      // A bot has joined a group, say hello
      this.controller.on('bot_group_join', (bot, message) => this.botJoinedChannel(bot, message));

      // A bot has joined a channel, say hello
      this.controller.on('bot_channel_join', (bot, message) => this.botJoinedChannel(bot, message));

      // Attempt to restart RTM on rtm_close event
      this.controller.on('rtm_close', bot => this.restartRtm(bot));

      // Updates local cache of team members
      this.controller.on('team_join', bot => this.updateUsers(bot));

      // Listens for button clicks
      this.controller.on('interactive_message_callback', (bot, message) => this.buttonClick(bot, message));

      // Add to Slack button was clicked, spawn new bot
      this.controller.on('create_bot', (bot, configuration) => this.botCreated(bot, configuration));

      // Problem Notification Event Listener
      this.event.on(this.davis.notifications.getProblemNamespace(), exchange => this.problemNotifications(exchange));
    })
    .then(() => BbPromise.promisify(this.controller.storage.teams.all)())
    .then(teams => { // eslint-disable-line
      return BbPromise.all(teams.map(team => { // eslint-disable-line
        if (team.bot) {
          return this.getDavisBotStatus(team.bot.token).then(bot => { // eslint-disable-line
            if (bot.online) {
              this.logger.warn('Skipping starting this Slack bot because it is already running.');
            } else {
              return BbPromise.promisify(this.controller.spawn(team).startRTM)();
            }
          });
        }
      }));
    })
    .then((botArray) => {
      botArray.forEach(bot => this.trackBot(bot));

      // Starting cache updating job
      // TODO Fix this
      this.davis.addCron('0 0 * * * *', () => {
        this.updateCache.bind(this);
      }, slack.CACHE_CRON_NAME, false);

      return this.updateCache();
    })
    .then(() => {
      this.logger.info('Slack as been successfully started.');
      this.started = true;
    })
    .catch((err) => {
      if (err.name === 'DavisError') {
        this.logger.warn(`Unable to start Slack Bot: ${err.message}`);
      } else {
        this.davis.utils.logError(err);
      }

      if (isRest) throw err;
    });
  }

  stop() {
    this.started = false;
    return BbPromise.resolve()
      .then(() => _.forEach(this.bots, bot => bot.destroy()))
      .then(() => {
        // clears the Davis channels array
        this.davisChannels.length = 0;
        this.davis.removeCron(slack.CACHE_CRON_NAME);
        this.logger.info('Successfully stopped Slack');
      })
      .catch(err => this.logger.warn(`Unable to stop Slack Bot: ${err.message}`));
  }

  restart() {
    return this.stop
      .then(this.start)
      .catch(err => this.logger.warn(`Unable to restart Slack Bot: ${err.message}`));
  }

  delete() {
    return this.stop()
      .then(() => this.davis.config.updateConfig('slack', { redirectUri: '', clientSecret: '', clientId: '', enabled: false }))
      .then(() => mongoose.createConnection(`${this.davis.config.getMongoDBConnectionString()}-botkit`))
      .then(conn => conn.dropDatabase())
      .catch(err => this.logger.warn(`Unable to delete Slack Bot: ${err.message}`));
  }

  // @davis or direct message
  respondToDirectMessage(bot, message) {
    if (message.text.startsWith('You have been removed from')) {
      this.logger.info('Davis was removed from a channel!');
      this.updateDavisChannels();
    } else {
      this.findUser(bot.team_info.id, message.user)
        .then((user) => {
          this.logger.info('Slack: Starting public conversation (direct_mention,direct_message)');
          bot.startConversation(message, (err, convo) => {
            const slackConvo = new SlackConversation(this.davis, this.sharedStorage);
            slackConvo.interact(message, convo, bot, user);
          });
        });
    }
  }

  // hey davis
  respondToAmbientMessages(bot, message) {
    this.findUser(bot.team_info.id, message.user)
      .then((user) => {
        this.logger.info('Slack: Starting public conversation (mention,ambient)');
        bot.startConversation(message, (err, convo) => {
          const slackConvo = new SlackConversation(this.davis, this.sharedStorage);
          slackConvo.interact(message, convo, bot, user);
        });
      });
  }

  buttonClick(bot, message) {
    this.logger.info('a button was clicked');
    const scopeArray = [
      slack.SLACK_REQUEST_SOURCE,
      message.team.id,
      message.channel,
      message.user,
    ];

    const scope = scopeArray.join(':');
    const chanScope = scopeArray.slice(0, 3).join(':');

    const intent = message.callback_id;

    const original = _.cloneDeep(message);
    const attachments = original.original_message.attachments;

    let footer, footer_icon;
    if (attachments) {
      footer = attachments[attachments.length - 1].footer;
      footer_icon = attachments[attachments.length - 1].footer_icon;
    }


    // Remove buttons from message and add clicked message
    const action = message.actions[0].name;
    let noButtons = this.utils.removeButtons(
        message.original_message,
        message.user,
        action);
    noButtons = this.utils.setListeningStateFooter(noButtons, 'clicked');
    bot.replyInteractive(original, noButtons);

    if (!this.sharedStorage[chanScope]) {
      this.sharedStorage[chanScope] = {};
    }

    this.sharedStorage[chanScope][noButtons.ts] = noButtons;

    let sUser;

    BbPromise.all([
      this.davis.users.getSystemUser(),
      this.findUser(bot.team_info.id, message.user),
    ])
      .spread((user, slackUser) => {
        sUser = slackUser;
        return new this.Exchange(this.davis, user).startInternal(scope);
      })
      .then((exchange) => {
        exchange.isSlackButton = true;

        exchange.addContext({
          button: message.actions[0],
          clicker: sUser.real_name || sUser.name,
        });

        return this.pluginManager.run(exchange, intent);
      })
      .then((exchange) => {
        if (exchange.noResponse) return;
        let response = exchange.getVisualResponse();

        // Attach recipient username as author and listening state footer
        response = this.utils.addUsernameAsAuthor(response, `<@${sUser.id}> clicked ${action}`);

        response.attachments[response.attachments.length - 1].footer = footer;
        response.attachments[response.attachments.length - 1].footer_icon = footer_icon;

        response.username = bot.identity.name;
        response.icon_url = bot.identity.icon_url;

        response.channel = message.channel;

        bot.api.chat.postMessage(response, (err, resp) => {
          if (!this.sharedStorage[chanScope].footer_ts) {
            this.sharedStorage[chanScope].footer_ts = 0;
          }

          if (err) this.logger.error(err);

          const ts = resp.message.ts;

          this.sharedStorage[chanScope][ts] = resp.message;
          if (this.sharedStorage[chanScope].footer_ts < ts) {
            this.sharedStorage[chanScope].footer_ts = ts;
          }
        });
      })
      .catch(err => this.logger.error(`Unable to push alert.  ${err.message}`));
  }

  problemNotifications(exchange) {
    const scopes = _.filter(exchange.getNotificationScopes(), scope => _.startsWith(scope, 'slack'));
    this.logger.info(`Attempting to send out ${scopes.length} notification(s).`);
    _.forEach(scopes, (scope) => {
      const detailedScope = scope.split(':');
      const team = detailedScope[1];
      const channel = detailedScope[2];
      if (_.find(this.davisChannels, { team_id: team, id: channel })) {
        // send message
        const message = exchange.getVisualResponse();
        if (exchange.filtered) {
          message.attachments[0].author_name = "@everyone";
          message.attachments[0].author_icon = 'https://s3.amazonaws.com/dynatrace-davis/assets/images/filter_blue_15_15.png';
        }
        message.channel = channel;
        this.bots[team].api.chat.postMessage(message);
      }
    });
  }

  // A user has joined a group, say hello
  userJoinedGroup(bot, message) {
    bot.replyPrivate(message, slack.MESSAGES.JOINED);
  }

  // A user has joined a channel, say hello
  userJoinedChannel(bot, message) {
    bot.replyPrivate(message, slack.MESSAGES.JOINED);
  }

  // A bot has joined a channel, say hello
  botJoinedChannel(bot, message) {
    this.updateDavisChannels();
    bot.startConversation(message, (err, convo) => {
      convo.say(slack.MESSAGES.JOINED);
    });
  }

  // Attempt to restart RTM on rtm_close event
  restartRtm(bot) {
    // No need to restart if Slack was disabled
    if (!this.davis.config.isSlackEnabled() || !this.started) return;

    setTimeout(() => {
      // Check that OAuth tokens are still valid
      BbPromise.promisify(bot.startRTM)()
        .then(() => this.updateCache())
        .then(() => this.logger.info('A Slack app bot experienced a rtm_close event, but RTM successfully restarted.'))
        .catch(err => this.logger.warn(`Unable to reconnect after an rtm_close event: ${err.message}`));
    }, 1000);
  }

  // Add to Slack button was clicked, spawn new bot
  botCreated(bot, configuration) {
    if (!this.bots[bot.config.id]) {
      BbPromise.promisify(this.controller.spawn({ token: configuration.token }).startRTM)()
        .then(() => {
          let message = {
            attachments: [{
              fallback: 'Welcome!',
              text: slack.MESSAGES.JOINED,
            }],
            channel: bot.config.incoming_webhook.channel_id,
            as_user: true,
          };

          // Attach recipient username as author and listening state footer
          message = this.davis.utils.Slack.addUsernameAsAuthor(message, 'everyone');
          message = this.davis.utils.Slack.addListeningStateFooter(message, false);

          bot.api.chat.postMessage(message);
        })
        .then(() => {
          this.trackBot(bot);
          return this.updateCache();
        })
        .then(() => this.logger.info('A new bot was successfully created.'))
        .catch(err => this.logger.error(`Unable to create a Slack bot: ${err.message}`));
    }
  }

  /**
   * Get Davis bot online status
   * Important for making sure other another Davis instance isn't running a Slack bot already
   * Note: Can't use Botkit API for this call since bot hasn't been spawned yet
   */
  getDavisBotStatus(token) {
    return rp({
      uri: `https://slack.com/api/users.getPresence?token=${token}`,
      json: true,
    });
  }

  updateCache() {
    return BbPromise.all([
      this.updateDavisChannels(),
      this.updateUsers(),
    ]);
  }

  updateDavisChannels() {
    this.logger.debug('Updating Davis Slack channels');
    const promiseArray = [];
    const tempDavisChannels = [];
    _.forEach(this.bots, (bot) => {
      const channelPromise = BbPromise.promisify(bot.api.channels.list)({}).then(res => _.assign(res, { team_name: bot.config.name, team_id: bot.config.id }));
      promiseArray.push(channelPromise);
    });
    return BbPromise.all(promiseArray)
      .then((res) => {
        res.forEach((team) => {
          team.channels.forEach((channel) => {
            if (channel.is_member) {
              tempDavisChannels.push({
                name: channel.name,
                id: channel.id,
                team_name: team.team_name,
                team_id: team.team_id,
              });
            }
          });
        });
        this.davisChannels = tempDavisChannels;
      })
      .catch(err => this.logger.error(`Unable to update Davis channel list: ${err.message}`));
  }

  findUser(team, id) {
    const user = _.find(this.users, { team_id: team, id });

    if (user) return BbPromise.resolve(user);

    return this.updateUsers()
      .then(() => _.find(this.users, { team_id: team, id }))
      .then((userPostUpdate) => {
        if (!userPostUpdate) throw new this.davis.classes.Error(`Unable to find a Slack user with the ID ${id} on team ${team}.`);
        return userPostUpdate;
      });
  }

  updateUsers() {
    this.logger.debug('Updating Slack user list');
    const promiseArray = [];
    const tempSlackUsers = [];
    _.forEach(this.bots, (bot) => {
      const userPromise = BbPromise.promisify(bot.api.users.list)({}).then(res => _.assign(res, { team_name: bot.config.name, team_id: bot.config.id }));
      promiseArray.push(userPromise);
    });
    return BbPromise.all(promiseArray)
      .then((res) => {
        res.forEach((team) => {
          team.members.forEach((member) => {
            if (member.deleted === false && member.is_bot === false && member.name !== 'slackbot') {
              tempSlackUsers.push(_.assign(member, {
                team_name: team.team_name,
                team_id: team.team_id,
              }));
            }
          });
        });
        this.users = tempSlackUsers;
      })
      .catch(err => this.logger.error(`Unable to update Slack user list: ${err.message}`));
  }

  getSlackUsers() {
    return this.users;
  }

  getDavisChannels() {
    return this.davisChannels;
  }

  trackBot(bot) {
    this.bots[bot.config.id] = bot;
  }

  oauthErrors(err, req, res) {
    if (err) {
      this.logger.error(`An OAuth error has occurred: ${err}`);
    }
  }
}

module.exports = Slack;
