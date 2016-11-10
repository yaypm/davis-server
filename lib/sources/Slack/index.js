'use strict';

const Botkit = require('botkit');
const BotkitStorage = require('botkit-storage-mongo');
const _ = require('lodash');
const BbPromise = require('bluebird');
const error = require('../../classes/Utils/Error');
const slack = require('../../config/slack');
const SlackConversation = require('./SlackConversation');
const rp = require('request-promise');

class Slack {
  constructor(davis) {
    this.logger = davis.logger;
    this.davisChannels = [];
    this.bots = {};
    this.pluginManager = davis.pluginManager;
    this.users = davis.users;
    this.Exchange = davis.classes.Exchange;

    this.davis = davis;
  }

  init() {
    const self = this;

    // Stop initialization if missing Slack App settings
    if (!this.davis.config.isSlackEnabled()
      || _.isNil(this.davis.config.getSlackClientId())
      || _.isNil(this.davis.config.getSlackClientSecret())
      || _.isNil(this.davis.config.getSlackRedirectUri())) {
      return false;
    }

    const controller = Botkit.slackbot({
      debug: false,
      interactive_replies: true,
      storage: BotkitStorage({ mongoUri: this.davis.config.getMongoDBConnectionString() }),
    }).configureSlackApp({
      clientId: this.davis.config.getSlackClientId(),
      clientSecret: this.davis.config.getSlackClientSecret(),
      redirectUri: this.davis.config.getSlackRedirectUri(),
      scopes: [
        'incoming-webhook', 'team:read', 'users:read',
        'channels:read', 'im:read', 'im:write', 'groups:read',
        'emoji:read', 'chat:write:bot'],
    });

    controller.config.port = this.davis.config.getDavisPort();
    controller.webserver = this.davis.server.app;

    // Set up web endpoints for oauth, receiving webhooks
    controller
      .createOauthEndpoints(controller.webserver)
      .createWebhookEndpoints(controller.webserver);

    // @davis or direct message
    controller.hears(['(.*)'], 'direct_mention,direct_message', (bot, message) => {
      if (message.text.startsWith('You have been removed from')) {
        self.logger.info('Oh no!  Davis was removed from a channel!');
        self.updateBotChannels(bot);
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
              bot.identity.icon_url = response.user.profile.image_original;

              self.logger.info('Slack: Starting public conversation (direct_mention,direct_message)');
              bot.startConversation(message, (err, convo) => {
                const slackConvo = new SlackConversation(self.davis);
                slackConvo.interact(message, convo, bot, user);
              });
            });
          });
        });
      }
    });

    // hey davis
    controller.hears(slack.PHRASES, 'mention,ambient', (bot, message) => {
      bot.api.users.list({}, (err, response) => {
        let user;
        response.members.forEach((member) => {
          if (member.id === message.user) {
            user = member;
          }
        });

        bot.identifyBot((err, response) => {
          bot.api.users.info({ user: response.id }, (err, response) => {
            bot.identity.icon_url = response.user.profile.image_original;

            self.logger.info('Slack: Starting public conversation (mention,ambient)');
            bot.startConversation(message, (err, convo) => {
              const slackConvo = new SlackConversation(self.davis);
              slackConvo.interact(message, convo, bot, user);
            });
          });
        });
      });
    });

    // A user has joined a channel, say hello
    controller.on('channel_joined', (bot, message) => {
      self.updateBotChannels(bot);
      bot.say(
        {
          text: 'Hi there, I\'m Davis, let me know if you have any DevOps related questions!',
          channel: message.channel,
        }
      );
    });

    // A bot has joined a channel, say hello
    controller.on('bot_channel_join', (bot, message) => {
      self.updateBotChannels(bot);
      bot.say(
        {
          text: 'Thanks for the invite! Message me if you need anything.',
          channel: message.channel,
        }
      );
    });

    // Attempt to restart RTM on rtm_close event
    controller.on('rtm_close', (bot) => {
      bot.startRTM((err) => {
        if (err) {
          throw new Error('Could not reconnect to Slack after rtm_close event');
        } else {
          self.logger.warn('A Slack app bot experienced a rtm_close event, but RTM successfully restarted');
        }
      });
    });

    // Add to Slack button was clicked, spawn new bot
    controller.on('create_bot', (bot, configuration) => {
      if (!this.bots[bot.config.token]) {
        const connectedBot = controller.spawn({
          token: configuration.token,
        }).startRTM(err => {
          if (err) {
            throw new Error('Could not connect to Slack');
          } else {
            self.trackBot(connectedBot);
            connectedBot.startPrivateConversation({ user: configuration.createdBy }, (err, convo) => {
              if (err) {
                console.log(err);
              } else {
                convo.say('I\'m a bot named Davis that just joined your team');
                convo.say('You can now /invite me to a channel or continue to interact with me in this direct message.');
              }
            });
          }
          self.updateBotChannels(bot);
        });
      }
    });

    // Spawn bots from storage (bots previously spawned in this Davis instance), called on startup
    controller.storage.teams.all((err, teams) => {
      if (err) {
        throw new Error(err);
      }

      // Spawn bots that aren't already running on another instance of Davis
      for (let t in teams) {
        if (teams[t].bot) {
          self.getDavisBotStatus(teams[t].bot.token)
            .then(resp => {
              if (!resp.online) {
                const connectedBot = controller.spawn(teams[t]).startRTM((err, bot) => {
                    if (err) {
                      console.log('Error connecting bot to Slack:', err);
                    } else {
                      self.trackBot(connectedBot);
                    }
                  });
              } else {
                self.logger.warn('Bot spawn aborted, another instance of Davis that is running is already using this bot');
              }
            });
        }
      }
    });
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
    this.davisChannels.splice(0, this.davisChannels.length);
    bot.api.channels.list({}, (err, response) => {
      if (response.hasOwnProperty('channels') && response.ok) {
        const total = response.channels.length;
        for (let i = 0; i < total; i++) {
          const channel = response.channels[i];
          // Lets update the list with the channels davis is currently a member of
          if (channel.is_member) this.davisChannels.push({ name: channel.name, id: channel.id });
        }
      }
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
  isMatch(subscribedChannel, channel, problem) {
    return subscribedChannel.name.toLowerCase() === channel.name.toLowerCase()           // Friendly channel names match
      && _.includes(subscribedChannel.state, problem.State.toLowerCase())              // Channel is interested in this state
      && _.includes(subscribedChannel.impact, problem.ProblemImpact.toLowerCase())     // Channel is interested in this impact
      && (subscribedChannel.tags.includes.length === 0
          || _.intersection(problem.Tags, subscribedChannel.tags.includes).length > 0) // At least one tag matches if tags were defined
      && _.intersection(problem.Tags, subscribedChannel.tags.excludes).length === 0;   // No tags match on the exclude list
  }
}

module.exports = Slack;
