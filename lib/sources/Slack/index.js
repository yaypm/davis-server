'use strict';

const BbPromise = require('bluebird');
const error = require('../../classes/Utils/Error');
const Botkit = require('botkit');
const BotkitStorage = require('botkit-storage-mongo');
const _ = require('lodash');
const slackConfig = require('../../config/slack');
const rp = require('request-promise');
const mongoose = require('mongoose');
const moment = require('moment');

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
    this.conversations = {};

    setInterval(() => this.reapConversations(), 1000);

    this.davis = davis;
    this.utils = davis.utils.Slack;
  }

  reapConversations() {
    const chanScopes = Object.keys(this.conversations);

    chanScopes.forEach((scope) => {
      if (!this.conversations[scope]) return;
      const now = moment().valueOf();
      const last = this.conversations[scope].lastInteraction;
      if (now - last > slackConfig.INACTIVITY_TIMEOUT * 1000) {
        this.conversations[scope] = false;

        // const team = scope.split(':')[1];
        // const channel = scope.split(':')[2];

        // this.bots[team].api.chat.postMessage({
          // text: "Guess we'll talk later",
          // channel,
        // });
      }
    });
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
        .createOauthEndpoints(this.controller.webserver)
        .createWebhookEndpoints(this.controller.webserver);

      // Registering Slack Event handlers
      //
      // Only the first hears handler that matches gets run

      // @davis or direct message
      this.controller.hears(['(.*)'], 'direct_message,direct_mention', (bot, message) =>
          this.interact(bot, message));

      // hey davis
      this.controller.hears(slackConfig.PHRASES, 'mention,ambient', (bot, message) =>
          this.interact(bot, message));

      this.controller.hears(['(.*)'], 'ambient', (bot, message) => this.ambient(bot, message));

      // Bot is removed from a channel
      this.controller.on('channel_left', (bot, message) => this.channelLeft(bot, message));

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
      this.event.on(this.davis.notifications.getProblemNamespace(), exchange =>
          this.problemNotifications(exchange));
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
        this.davis.removeCron(slackConfig.CACHE_CRON_NAME);
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

  channelLeft(bot, message) {
    this.logger.info(`Davis was removed from a channel (${message.channel})!`);
    this.updateDavisChannels();
  }

  ambient(bot, message) {
    const scopeArr = [
      slackConfig.SLACK_REQUEST_SOURCE,
      message.team,
      message.channel,
      message.user,
    ];
    const scope = scopeArr.join(':');
    const chanScope = scopeArr.slice(0, 3).join(':');
    const channelConversation = this.conversations[chanScope];

    if (channelConversation && channelConversation.scope === scope) {
      this.interact(bot, message);
    }
  }

  interact(bot, message) {
    // slack bot sends private message when you leave a channel
    if (message.event === 'direct_message' && message.user === 'USLACKBOT') return;

    const postMessage = BbPromise.promisify(bot.api.chat.postMessage);
    const update = BbPromise.promisify(bot.api.chat.update);

    const scopeArr = [
      slackConfig.SLACK_REQUEST_SOURCE,
      message.team,
      message.channel,
      message.user,
    ];
    const scope = scopeArr.join(':');
    const chanScope = scopeArr.slice(0, 3).join(':');
    const channelConversation = this.conversations[chanScope];

    if (channelConversation && channelConversation.scope !== scope) {
      // someone else is already having a conversation in this channel
      this.logger.info(`Slack: ${message.user} tried to start a conversation but ${channelConversation.user} was already talking`);
      return;
    }

    // create a conversation if it did not exist
    if (!channelConversation) {
      this.logger.info(`Slack: Starting conversation (${message.event})`);
      this.conversations[chanScope] = {
        scope,
        team: message.team,
        channel: message.channel,
        user: message.user,
      };
    }

    this.conversations[chanScope].lastInteraction = moment().valueOf();

    const working = {
      text: 'hang on',
      channel: message.channel,
      as_user: false,
    };

    let workingTs;
    postMessage(working)
      .then((res) => {
        workingTs = res.ts;
        return this.askDavis(message, scope);
      })
      .then((res) => {
        const response = res.response.outputSpeech.card;
        const shouldEndSession = res.response.shouldEndSession;
        response.ts = workingTs;
        response.channel = message.channel;
        this.conversations[chanScope].lastInteraction = moment().valueOf();
        if (shouldEndSession) {
          this.conversations[chanScope] = false;
        }

        // change our 'working' message to the final message
        return update(response);
      });
  }

  askDavis(message, scope) {
    return this.findUser(message.team, message.user)
      .then(user => this.davis.users.validateSlackUser(user))
      .then(user =>
        new this.Exchange(this.davis, user)
          .start(message.text, slackConfig.SLACK_REQUEST_SOURCE, scope))
      .then(exchange => this.pluginManager.run(exchange))
      .then(exchange => this.formatResponse(exchange))
      .catch(err => this.formatErrorResponse(err));
  }

  askDavisButton(button, scope) {
    const scopeArr = scope.split(':');
    const team = scopeArr[1];
    const sUser = scopeArr[3];

    return this.findUser(team, sUser)
      .then(user => this.davis.users.validateSlackUser(user))
      .then(user =>
        new this.Exchange(this.davis, user)
          .start(' ', slackConfig.SLACK_REQUEST_SOURCE, scope))
      .then((exchange) => {
        const name = exchange.user.name;
        exchange.button = true;
        const context = {
          button,
          clicker: `${name.first} ${name.last}`.trim(),
        };
        return exchange.addExchangeContext(context);
      })
      .then(exchange => this.pluginManager.run(exchange, button.intent))
      .then(exchange => this.formatResponse(exchange))
      .catch(err => this.formatErrorResponse(err));
  }

  formatResponse(exchange) {
    this.logger.info('Generating the response for Slack');

    let outputSpeech;

    if (exchange.getVisualResponse()) {
      outputSpeech = {
        type: 'card',
        card: exchange.getVisualResponse(),
      };
    } else {
      outputSpeech = {
        type: 'text',
        text: exchange.getTextResponse(),
      };
    }

    return {
      response: {
        shouldEndSession: exchange.shouldConversationEnd(),
        outputSpeech,
        filtered: Boolean(exchange.filtered),
      },
    };
  }

  formatErrorResponse(err) {
    let message;
    if (err.name === 'DavisError') {
      message = err.message;
    } else {
      // Adding a generic error message and logging the exception.
      message = 'Unfortunately an unhandled error has occurred.';
      error.logError(err);
    }
    return message;
  }

  buttonClick(bot, message) {
    const team = message.team.id;
    const channel = message.channel;
    const slackUser = message.user;
    const scopeArr = [
      slackConfig.SLACK_REQUEST_SOURCE,
      team,
      channel,
      slackUser,
    ];
    const scope = scopeArr.join(':');

    const postMessage = BbPromise.promisify(bot.api.chat.postMessage);
    const update = BbPromise.promisify(bot.api.chat.update);
    const replyInteractive = BbPromise.promisify(bot.replyInteractive);
    // const chanScope = scopeArr.slice(0, 3).join(':');

    const button = this.extractButtonDetails(message.text);
    const action = message.actions[0];
    button.name = action.name;
    button.callback_id = message.callback_id;

    // buttons messages do not replace by default
    button.replace = (_.isNil(button.replace)) ? false : button.replace;
    // buttons do not persist after clicking by default
    button.persist = (_.isNil(button.persist)) ? false : button.persist;
    // button handling is assumed to be slow
    button.slow = (_.isNil(button.slow)) ? true : button.slow;
    button.intent = button.intent || button.callback_id;

    const noButtons = this.utils.removeButtons(message.original_message, message.user, action.name);
    const working = (button.slow || !button.replace) ?
      replyInteractive(message, noButtons) :
      BbPromise.resolve();

    working
      .then(() => this.askDavisButton(button, scope))
      .then((formatted) => {
        const response = formatted.response.outputSpeech.card;
        if (button.replace) {
          response.ts = message.message_ts;
          response.channel = message.channel;
          update(response)
            .catch(err => this.logger.error(err));
        } else {
          response.as_user = false;
          response.channel = message.channel;
          postMessage(response);
        }
      });
  }

  // Attempt to parse input as JSON, fall back on
  // old style string handling if JSON does not work
  extractButtonDetails(inp) {
    let data;
    try {
      data = JSON.parse(inp);
    } catch (e) {
      data = inp;
    }
    if (_.isObject(data)) {
      return data;
    }

    if (_.isString(data)) {
      const arr = data.split(':');
      return (arr.length === 1) ?
        { value: arr[0] } :
        { intent: arr[0], value: arr[1] };
    }

    return { value: data };
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
          message.attachments[0].author_name = '@everyone';
          message.attachments[0].author_icon = 'https://s3.amazonaws.com/dynatrace-davis/assets/images/filter_blue_15_15.png';
        }
        message.channel = channel;
        this.bots[team].api.chat.postMessage(message);
      }
    });
  }

  // A user has joined a group, say hello
  userJoinedGroup(bot, message) {
    bot.replyPrivate(message, slackConfig.MESSAGES.JOINED);
  }

  // A user has joined a channel, say hello
  userJoinedChannel(bot, message) {
    bot.replyPrivate(message, slackConfig.MESSAGES.JOINED);
  }

  // A bot has joined a channel, say hello
  botJoinedChannel(bot, message) {
    this.updateDavisChannels();
    bot.startConversation(message, (err, convo) => {
      convo.say(slackConfig.MESSAGES.JOINED);
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
              text: slackConfig.MESSAGES.JOINED,
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
      const channelPromise = BbPromise
        .promisify(bot.api.channels.list)({})
        .then(res => _.assign(res, { team_name: bot.config.name, team_id: bot.config.id }));

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
      const userPromise = BbPromise
        .promisify(bot.api.users.list)({})
        .then(res => _.assign(res, { team_name: bot.config.name, team_id: bot.config.id }));
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
}

module.exports = Slack;
