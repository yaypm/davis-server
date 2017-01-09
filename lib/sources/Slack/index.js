'use strict';

const BbPromise = require('bluebird');
const Botkit = require('botkit');
const BotkitStorage = require('botkit-storage-mongo');
const _ = require('lodash');
const slack = require('../../config/slack');
const SlackConversation = require('./SlackConversation');
const rp = require('request-promise');

class Slack {
  constructor(davis) {
    this.logger = davis.logger;
    this.bots = {};
    this.davisChannels = [];
    this.pluginManager = davis.pluginManager;
    this.event = davis.event;
    this.users = davis.users;
    this.Exchange = davis.classes.Exchange;
    this.SlackConversation = new SlackConversation(davis); // Used for formatter methods in createNotification
    this.started = false;

    this.davis = davis;
  }

  start(isRest) {
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
      } else if (this.started) {
        throw new this.davis.classes.Error('Slack has already been started.');
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
          'incoming-webhook', 'team:read', 'users:read',
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
      this.controller.on('rtm_close', (bot) => this.restartRtm(bot));

      // Listens for button clicks
      this.controller.on('interactive_message_callback', (bot, message) => {
        this.logger.info('a button was clicked');
        if (!message.callback_id.startsWith('_proactive_')) return;
        BbPromise.promisify(bot.api.users.info)({ user: message.user })
          .then((slackUser) => {
            message.user_name = slackUser.user.name;
            message.user_real_name = slackUser.user.real_name;
          })
          .then(() => this.users.getSystemUser())
          .then(user => new this.Exchange(this.davis, user).startInternal())
          .then((exchange) => {
            exchange.isSlackButton = true;
            exchange.addContext({ button: message.actions[0], message });
            return exchange;
          })
          .then(exchange => this.pluginManager.run(exchange, message.callback_id.slice(11)))
          .then((exchange) => {
            let response = exchange.getVisualResponse();

            // Attach recipient username as author and listening state footer
            response = this.SlackConversation.addUsernameAsAuthor(response, 'everyone');
            response = this.SlackConversation.addListeningStateFooter(response, false);

            bot.replyInteractive(message, response);
          })
          .catch(err => this.logger.error(`Unable to push alert.  ${err.message}`));
      });

      // Add to Slack button was clicked, spawn new bot
      this.controller.on('create_bot', (bot, configuration) => this.botCreated(bot, configuration));

      // Listens for problem events and pushes them to the subscribed channels.
      this.event.on('davis.event.problem.*', (problem) => this.problemNotifications(problem));
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
    .then(botArray => {
      botArray.forEach(bot => {
        this.trackBot(bot);
        this.updateBotChannels(bot);
      });
      this.logger.info('Slack as been successfully started.');
      this.started = true;
    })
    .catch(err => {
      if (isRest) {
        throw err;
      }
      this.logger.warn(`Unable to start Slack Bot: ${err.message}`);
    });
  }

  stop() {
    // TODO
    this.logger.warn("Stopping Slack hasn't been implemented yet.");
    return BbPromise.resolve();
  }

  restart() {
    return BbPromise.resolve()
      .then(this.stop)
      .then(this.start);
  }

  // @davis or direct message
  respondToDirectMessage(bot, message) {
    if (message.text.startsWith('You have been removed from')) {
      this.logger.info('Davis was removed from a channel!');
      this.updateBotChannels(bot);
    } else {
      bot.api.users.list({}, (err, response) => {
        let user;
        response.members.forEach((member) => {
          if (member.id === message.user) {
            user = member;
          }
        });

        bot.identifyBot((err, response) => {
          bot.api.users.info({ user: response.id }, (err, response) => {
            // Required for updating message history (listening status)
            bot.identity.icon_url = response.user.profile.image_original;

            this.logger.info('Slack: Starting public conversation (direct_mention,direct_message)');
            bot.startConversation(message, (err, convo) => {
              const slackConvo = new SlackConversation(this.davis);
              slackConvo.interact(message, convo, bot, user);
            });
          });
        });
      });
    }
  }

  // hey davis
  respondToAmbientMessages(bot, message) {
    bot.api.users.list({}, (err, response) => {
      let user;
      response.members.forEach((member) => {
        if (member.id === message.user) {
          user = member;
        }
      });

      bot.identifyBot((err, response) => {
        bot.api.users.info({ user: response.id }, (err, response) => {
          // Required for updating message history (listening status)
          bot.identity.icon_url = response.user.profile.image_original;

          this.logger.info('Slack: Starting public conversation (mention,ambient)');
          bot.startConversation(message, (err, convo) => {
            const slackConvo = new SlackConversation(this.davis);
            slackConvo.interact(message, convo, bot, user);
          });
        });
      });
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
    this.updateBotChannels(bot);
    bot.startConversation(message, (err, convo) => {
      convo.say(slack.MESSAGES.JOINED);
    });
  }

  // Attempt to restart RTM on rtm_close event
  restartRtm(bot) {
    setTimeout(() => {
      // Check that OAuth tokens are still valid
      bot.api.auth.test({}, err => {
        if (err) {
          this.logger.warn('Could not reconnect to Slack after rtm_close event. Auth failed, most likely OAuth tokens were revoked.');
        } else {
          // Restart RTM
          bot.startRTM(err => {
            if (err) {
              this.logger.warn('Could not reconnect to Slack after rtm_close event.');
            } else {
              this.logger.warn('A Slack app bot experienced a rtm_close event, but RTM successfully restarted.');
              this.updateBotChannels(bot);
            }
          });
        }
      });
    }, 1000);
  }

  // Add to Slack button was clicked, spawn new bot
  botCreated(bot, configuration) {
    if (!this.bots[bot.config.token]) {
      this.controller.spawn({
        token: configuration.token,
      }).startRTM(err => {
        if (err) {
          this.logger.warn('Could not connect to Slack');
        } else {
          this.trackBot(bot);
          this.updateBotChannels(bot);

          let message = {
            attachments: [{ text: slack.MESSAGES.JOINED }],
            channel: bot.config.incoming_webhook.channel_id,
            as_user: true,
          };

          // Attach recipient username as author and listening state footer
          message = this.SlackConversation.addUsernameAsAuthor(message, 'everyone');
          message = this.SlackConversation.addListeningStateFooter(message, false);

          bot.api.chat.postMessage(
            message,
            (err, response) => {}
          );
        }
      });
    }
  }

  problemNotifications(problem) {
    this.logger.debug(`A problem notification for ${problem.PID} has been received.`);
    const alertRules = this.davis.config.getSlackAlertRules();

    if (this.davis.config.isSlackAlertsEnabled()) {
      _.each(this.davisChannels, channel => {
        _.some(alertRules, rule => {
          if (this.isMatch(rule, channel, problem)) {
            if (rule.enabled === false) {
              this.logger.debug(`Skipping sending an alert to ${channel.name} because the matching rule has been disabled.`);
            } else {
              this.logger.info(`Pushing an alert to ${channel.name}.`);

              this.users.getSystemUser()
                .then(user => {
                  // Allows the user to pick a default timezone for notifications in a channel
                  user.timezone = rule.timezone || user.timezone;
                  const exchange = new this.Exchange(this.davis, user);
                  return exchange.startInternal();
                })
                .then(exchange => exchange.addContext({ pid: problem.PID }))
                .then(exchange => this.pluginManager.run(exchange, 'problemNotification'))
                .then(exchange => {
                  let message = exchange.getVisualResponse();
                  message.channel = channel.id;

                  // Attach recipient username as author and listening state footer
                  message = this.SlackConversation.addUsernameAsAuthor(message, 'everyone');
                  message = this.SlackConversation.addListeningStateFooter(message, false);

                  channel.bot.api.chat.postMessage(message);
                })
                .catch(err => {
                  this.logger.error(`Unable to push alert.  ${err.message}`);
                });
            }
          }
        });
      });
    } else {
      this.logger.debug('Skipping sending an alert because Slack notifications have been globally disabled.');
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

  updateBotChannels(bot) {
    // Clears the array of channels
    this.davisChannels.splice(0, this.davisChannels.length);
    bot.api.channels.list({}, (err, response) => {
      if (!err && response.ok) {
        response.channels.forEach((channel) => {
          // Lets update the list with the channels davis is currently a member of
          if (channel.is_member) {
            this.davisChannels.push({ name: channel.name, id: channel.id, bot });
          }
        });
      }
    });
  }

  getDavisChannels() {
    return this.davisChannels.map((channel) => {
      return {
        name: channel.name,
        id: channel.id,
        team_name: channel.bot.team_info.name,
        team_id: channel.bot.team_info.id,
      };
    });
  }

  trackBot(bot) {
    this.bots[bot.config.token] = bot;
  }

  /**
   * Determine if user should receive notifications
   *
   * @param subscribedChannel {Object}
   * @param channel {Object}
   * @param problem {Object}
   */
  isMatch(rule, channel, problem) {
    return rule.name.toLowerCase() === channel.name.toLowerCase()           // Friendly channel names match
          && _.includes(rule.state, problem.State.toLowerCase())              // Channel is interested in this state
          && _.includes(rule.impact, problem.ProblemImpact.toLowerCase())     // Channel is interested in this impact
          && (rule.tags.includes.length === 0
              || _.intersection(problem.Tags, rule.tags.includes).length > 0) // At least one tag matches if tags were defined
          && _.intersection(problem.Tags, rule.tags.excludes).length === 0;   // No tags match on the exclude list
  }

}

module.exports = Slack;
