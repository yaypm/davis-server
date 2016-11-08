'use strict';

const Botkit = require('botkit');
const BotkitStorage = require('botkit-storage-mongo');
const rp = require('request-promise');
const _ = require('lodash');
const error = require('../classes/Utils/Error');

const PHRASES = [
  '^hey davis',
  '^hey, davis',
  '^okay davis',
  '^okay, davis',
  '^ok davis',
  '^ok, davis',
  '^hi davis',
  '^hi, davis',
  '^yo davis',
  '^yo, davis',
  '^launch davis',
  '^ask davis',
];

const STATES = {
  LISTENING: {
    ICON: 'https://s3.amazonaws.com/dynatrace-davis/assets/images/green-dot.png',
    TEXT: 'Listening',
  },
  SLEEPING: {
    ICON: 'https://s3.amazonaws.com/dynatrace-davis/assets/images/grey-dot.png',
    TEXT: 'Wake me by saying "Hey Davis"',
  },
  RESPONDED: {
    ICON: 'https://s3.amazonaws.com/dynatrace-davis/assets/images/grey-dot.png',
    TEXT: 'Responded',
  },
};

class Slack {
  constructor(davis) {
    this.logger = davis.logger;
    this.davis = davis;

    this._bots = {};

    const controller = Botkit.slackbot({
      debug: true,
      interactive_replies: true,
      storage: BotkitStorage({ mongoUri: davis.config.getMongoDBConnectionString() }),
    }).configureSlackApp({
      clientId: davis.config.getSlackClientId(),
      clientSecret: davis.config.getSlackClientSecret(),
      redirectUri: davis.config.getSlackRedirectUri(),
      scopes: [
        'incoming-webhook', 'team:read', 'users:read', 'channels:read',
        'im:read', 'im:write', 'groups:read', 'emoji:read', 'chat:write:bot',
      ],
    });
    this.controller = controller;


    controller.config.port = this.davis.config.getDavisPort();
    controller.webserver = require('../server/routes/api/slack'); // eslint-disable-line global-require,max-len

    controller
      .createOauthEndpoints(controller.webserver)
      .createWebhookEndpoints(controller.webserver);


    controller.hears(['(.*)'], 'direct_mention,direct_message', (bot, message) => {
      if (message.text.startsWith('You have been removed from')) {
        this.davis.logger.info('Davis was removed from a channel');
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
              bot.identity.icon_url = response.user.profile.image_original;

              this.davis.logger.info('Slack: Starting public conversation (direct_mention,direct_message)');
              bot.startConversation(message, (err, convo) => {
                const slackConvo = new SlackConversation();
                slackConvo.interact(message, convo, bot, user);
              });
            });
          });
        });
      }
    });

    controller.hears(PHRASES, 'mention,ambient', (bot, message) => {
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

            this.davis.logger.info('Slack: Starting public conversation (mention,ambient)');
            bot.startConversation(message, (err, convo) => {
              const slackConvo = new SlackConversation();
              slackConvo.interact(message, convo, bot, user);
            });
          });
        });
      });
    });

    controller.on('bot_channel_join', (bot, message) => {
      this.updateBotChannels(bot);
      bot.say(
        {
          text: 'Thanks for the invite! Message me if you need anything.',
          channel: message.channel,
        }
        );
    });

    controller.on('rtm_close', (bot) => {
      bot.startRTM((err) => {
        if (err) {
          throw new Error('Could not reconnect to Slack after rtm_close event');
        } else {
          davis.logger.warn('A Slack app bot experienced a rtm_close event, but RTM successfully restarted');
        }
      });
    });

    controller.on('create_bot', (bot, configuration) => {
      if (!this._bots[bot.config.token]) {
        const connectedBot = controller.spawn({
          token: configuration.token,
        }).startRTM(err => {
          if (err) {
            throw new Error('Could not connect to Slack');
          } else {
            this.trackBot(connectedBot);
            connectedBot.startPrivateConversation({ user: configuration.createdBy }, (err, convo) => {
              if (err) {
                error.logError(err);
              } else {
                convo.say('I\'m a bot named Davis that just joined your team');
                convo.say('You can now /invite me to a channel or continue to interact with me in this direct message.');
              }
            });
          }
          this.updateBotChannels(bot);
        });
      }
    });

    controller.storage.teams.all((err, teams) => {
      if (err) {
        throw new Error(err);
      }

        // Spawn bots that aren't already running on another instance of Davis
      for (const t in teams) {
        if (teams[t].bot) {
          this.getDavisBotStatus(teams[t].bot.token).then(resp => {
            if (!resp.online) {
              const connectedBot = controller.spawn(teams[t]).startRTM((err, bot) => {
                if (err) {
                  error.logError(err);
                } else {
                  this.trackBot(connectedBot);
                }
              });
            } else {
              this.davis.logger.warn('Bot spawn aborted, another instance of Davis that is running is already using this bot');
            }
          });
        }
      }
    });

    // TODO Add notifications
  }

  updateBotChannels(bot) {
    this.davisChannels.splice(0, this.davisChannels.length);
    bot.api.channels.list({}, function (err, response) {
      if ({}.hasOwnProperty.call(response, 'channels') && response.ok) {
        const total = response.channels.length;
        for (let i = 0; i < total; i++) {
          const channel = response.channels[i];
          if (channel.is_member) {
            this.davisChannels.push({
              name: channel.name,
              id: channel.id,
            });
          }
        }
      }
    });
  }

  trackBot(bot) {
    this._bots[bot.config.token] = bot;
  }

  getDavisBotStatus(token) {
    return rp({
      uri: `https://slack.com/api/users.getPresence?token=${token}`,
      json: true,
    });
  }

  showTypingNotification(channel, bot) {
    bot.say({
      type: 'typing',
      channel,
    });
  }

  addUsernameAsAuthor(message, username) {
    // Move message's text property into the first attachment
    if (message.text) {
      message.attachments.unshift({ text: message.text, fallback: message.text });
      delete message.text;
    }

    message.attachments[0].author_name = `@${username}`;
    return message;
  }

  addListeningStateFooter(message, isListening) {
        // Move all pretext property values to text property values if text property isn't already used
    message.attachments.forEach((atm, index) => {
      if (atm.pretext && atm.pretext.length > 0 && (!atm.text || atm.text.trim().length == 0)) {
        message.attachments[index].text = atm.pretext;
        delete message.attachments[index].pretext;
      }
    });

        // Add footer to existing attachment if an image_url doesn't exist
    if (message.attachments.length > 0 && !message.attachments[message.attachments.length - 1].image_url) {
      message.attachments[message.attachments.length - 1].footer_icon = (isListening) ? STATES.LISTENING.ICON : STATES.SLEEPING.ICON;
      message.attachments[message.attachments.length - 1].footer = (isListening) ? STATES.LISTENING.TEXT : STATES.SLEEPING.TEXT;

        // Add footer to new attachment
    } else if (message.attachments.length > 0) {
      message.attachments.push({
        text: '',
        footer_icon: (isListening) ? STATES.LISTENING.ICON : STATES.SLEEPING.ICON,
        footer: (isListening) ? STATES.LISTENING.TEXT : STATES.SLEEPING.TEXT,
      });

        // Define attachments and add footer to new attachment
    } else {
      message.attachments = [{
        footer_icon: (isListening) ? STATES.LISTENING.ICON : STATES.SLEEPING.ICON,
        footer: (isListening) ? STATES.LISTENING.TEXT : STATES.SLEEPING.TEXT,
      }];
    }

        // Move any buttons in the bottom-most attachment to beneath follow up question in footer
    if (message.attachments.length > 1 && message.attachments[message.attachments.length - 2].actions) {
      message.attachments[message.attachments.length - 1].callback_id = message.attachments[message.attachments.length - 2].callback_id;
      message.attachments[message.attachments.length - 1].actions = message.attachments[message.attachments.length - 2].actions;
    }

    return message;
  }

  updateListeningStateFooter(convo, bot, responded) {
    const message = convo.sent[convo.sent.length - 1];
    const channel = convo.source_message.channel;

    if (message) {
                // Inject footer with listening status of inactive
      if (convo.source_message.event !== 'direct_message') {
        message.attachments[message.attachments.length - 1].footer_icon = (responded) ? STATES.RESPONDED.ICON : STATES.SLEEPING.ICON;
        message.attachments[message.attachments.length - 1].footer = (responded) ? STATES.RESPONDED.TEXT : STATES.SLEEPING.TEXT;
      }

      if (message.attachments.length > 0 && message.attachments[message.attachments.length - 1].actions) {
        message.attachments[message.attachments.length - 1].callback_id = null;
        message.attachments[message.attachments.length - 1].actions = null;
      }

      const editedMessage = {
        ts: message.ts,
        text: message.text,
        attachments: JSON.stringify(message.attachments),
        channel,
        as_user: false,
      };

      bot.api.chat.update(editedMessage, err => {
        if (err) throw new Error('Could not update existing Slack message');
      });
    } else {
      this.davis.logger.warn('Failed to update Slack message footer');
    }
  }

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
