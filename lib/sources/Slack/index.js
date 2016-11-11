'use strict';

const Botkit = require('botkit');
const BotkitStorage = require('botkit-storage-mongo');
const _ = require('lodash');
const BbPromise = require('bluebird');
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
    
    this.davis = davis;
  }
    
  init() {
    
    var self = this;
    
    // Stop initialization if missing Slack App settings 
    if (!this.davis.config.isSlackEnabled()
      || _.isNil(this.davis.config.getSlackClientId()) 
      || _.isNil(this.davis.config.getSlackClientSecret()) 
      || _.isNil(this.davis.config.getSlackRedirectUri())) {
        return false;
    }

    const controller = Botkit.slackbot({
        debug: process.env.SLACK_DEBUG || false,
        interactive_replies: true,
        storage: BotkitStorage({mongoUri: `${this.davis.config.getMongoDBConnectionString()}-botkit`})
    }).configureSlackApp({
        clientId: this.davis.config.getSlackClientId(),
        clientSecret: this.davis.config.getSlackClientSecret(),
        redirectUri: this.davis.config.getSlackRedirectUri(),
        scopes: ['incoming-webhook','team:read','users:read','channels:read','im:read','im:write','groups:read','emoji:read','chat:write:bot']
    });
  
    controller.config.port = 3000;
    controller.webserver = this.davis.server.app;
    
    // Set up web endpoints for oauth, receiving webhooks
    controller.createOauthEndpoints(controller.webserver).createWebhookEndpoints(controller.webserver);
    
    // @davis or direct message
    controller.hears(['(.*)'], 'direct_mention,direct_message', (bot, message) => {
      
        if(message.text.startsWith('You have been removed from')) {
            self.logger.info('Oh no! Davis was removed from a channel!');
            self.updateBotChannels(bot);
        } else {
            
          bot.api.users.list({}, function (err, response) {
              
              let user;
              response.members.forEach( (member) => {
                  if (member.id === message.user) {
                      user = member;
                  }
              });
              
              bot.identifyBot( (err, response) => {
                  
                  bot.api.users.info( {user: response.id}, (err, response) => {
                      
                      // Required for updating message history (listening status)
                      bot.identity.icon_url = response.user.profile.image_original;
              
                      self.logger.info('Slack: Starting public conversation (direct_mention,direct_message)');
                      bot.startConversation(message, (err, convo) => {
                          let slackConvo = new SlackConversation(self.davis);
                          slackConvo.interact(message, convo, bot, user);
                      });
              
                  });
              });
          });
        }
    });
    
    // hey davis
    controller.hears(slack.PHRASES, 'mention,ambient', (bot, message) => {
        
        bot.api.users.list({}, function (err, response) {
            
            let user;
            response.members.forEach( (member) => {
                
                if (member.id === message.user) {
                    user = member;
                }
            });
            
            bot.identifyBot( (err, response) => {
                
                bot.api.users.info( {user: response.id}, (err, response) => {
                    
                    // Required for updating message history (listening status)
                    bot.identity.icon_url = response.user.profile.image_original;
                    
                    self.logger.info('Slack: Starting public conversation (mention,ambient)');
                    bot.startConversation(message, (err, convo) => {
                        let slackConvo = new SlackConversation(self.davis);
                        slackConvo.interact(message, convo, bot, user);
                    });
                });
            });
        });
    });
    
    // A user has joined a channel, say hello
    controller.on('group_joined', (bot, message) => {
       bot.replyPrivate(message, slack.MESSAGES.JOINED);
    });
    
    // A user has joined a channel, say hello
    controller.on('channel_joined', (bot, message) => {
       bot.replyPrivate(message, slack.MESSAGES.JOINED);
    });

    // A bot has joined a channel, say hello
    controller.on('bot_channel_join', (bot, message) => {
      self.updateBotChannels(bot);
      bot.startConversation(message,function(err,convo) {
        convo.say(slack.MESSAGES.JOINED);
      });
    });

    // Attempt to restart RTM on rtm_close event
    controller.on('rtm_close', (bot) => {
      
      setTimeout(() => {
        // Check that OAuth tokens are still valid
        bot.api.auth.test({}, function (err, response) {
          if (err) {
            self.logger.warn('Could not reconnect to Slack after rtm_close event. Auth failed, most likely OAuth tokens were revoked');
          } else {
            
            // Restart RTM
            bot.startRTM(function(err) {
              if (err) {
                self.logger.warn('Could not reconnect to Slack after rtm_close event');
              } else {
                self.logger.warn('A Slack app bot experienced a rtm_close event, but RTM successfully restarted');
                self.updateBotChannels(bot);
              }
            });
          }
        });
      }, 1000);
    });
    
    // Add to Slack button was clicked, spawn new bot
    controller.on('create_bot', (bot, configuration) => {

      if (!this.bots[bot.config.token]) {
        controller.spawn({
          token: configuration.token
        }).startRTM(err => {
          if (err) {
            self.logger.warn('Could not connect to Slack');
          } else {
            self.trackBot(bot);
            self.updateBotChannels(bot);
            
            let message = {
              attachments: [{text: slack.MESSAGES.JOINED}], 
              channel: bot.config.incoming_webhook.channel_id,
            };
            
            // Attach recipient username as author and listening state footer
            message = self.SlackConversation.addUsernameAsAuthor(message, 'channel');
            message = self.SlackConversation.addListeningStateFooter(message, false);
            
            bot.api.chat.postMessage(
              message, 
              function (err, response) {}
            );
          }
        });
      }
    
    });
    
    // Spawn bots from storage (bots previously spawned in this Davis instance), called on startup
    controller.storage.teams.all(function(err,teams) {

        if (err) {
            self.logger.warn(err);
        }
    
        // Spawn bots that aren't already running on another instance of Davis
        for (var t in teams) {
            
            if (teams[t].bot) {
                
                self.getDavisBotStatus(teams[t].bot.token).then( resp => {
                    
                    if (!resp.online) {
                        
                        let connectedBot = controller.spawn(teams[t]).startRTM( (err, bot) => {
                            
                            if (err) {
                                console.log('Error connecting bot to Slack:',err);
                            } else {
                                self.trackBot(connectedBot);
                                self.updateBotChannels(bot);
                            }
                        });
                    } else {
                        self.logger.warn('Bot spawn aborted, another instance of Davis that is running is already using this bot');
                    }
                });
            }
        }
    });
    
    // Notifications: Awaiting direct intent support in exchange
    /*if (_.get(this.davis.config, 'slack.notifications.alerts.enabled', false)) {
      
      this.logger.info('Problem notifications in Slack has been enabled');
      
      this.event.on('event.problem.*', problem => {
          
        this.logger.debug(`A problem notification for ${problem.PID} has been received.`);
       
            _.each(this.davisChannels, channel => {
                
              _.some(_.get(this.davis.config, 'slack.notifications.alerts.channels', []), subscribedChannel => {
                  
                if ( this.isMatch(subscribedChannel, channel, problem) ) {
                    
                  this.logger.info(`Push an alert to ${channel.name}`);
                  
                  let user = {
                      id: 'davis-system',
                      nlp: this.davis.config.nlp,
                      dynatrace: this.davis.config.getDynatraceUrl(),
                      timezone: 'UTC'
                  };
   
                  const exchange = new this.Exchange(this.davis, user);
                  this.createNotification(exchange)
                    .then(response => {

                      let message = {
                        text: response.text,
                        attachments: response.attachments, 
                        channel: channel.id,
                      };
                      
                      // Attach recipient username as author and listening state footer
                      message = self.SlackConversation.addUsernameAsAuthor(message, 'channel');
                      message = self.SlackConversation.addListeningStateFooter(message, false);
                      
                      bot.api.chat.postMessage(
                        message, 
                        function (err, response) {}
                      );
                    })
                    .catch(err => {
                      this.logger.error(`Unable to push alert.  ${err.message}`);
                    });
                }
              });
            });
        });
    }*/
  
  }
  
  createNotification(exchange) {
    // need a replacement for davis.process('problemDetails', {problemId: problem.PID})
    return exchange.start('', slack.SLACK_REQUEST_SOURCE)
      .then(exchange => this.pluginManager.run(exchange))
      .then(exchange => this.SlackConversation.formatResponse(exchange))
      .catch(err => this.SlackConversation.formatErrorResponse(err));
  }
  
  /**
   * Get Davis bot online status
   * Important for making sure other another Davis instance isn't running a Slack bot already
   * Note: Can't use Botkit API for this call since bot hasn't been spawned yet
   */
  getDavisBotStatus(token) {
      
      return new BbPromise((resolve, reject) => {
          
          resolve(rp({
              uri: `https://slack.com/api/users.getPresence?token=${token}`,
              json: true
          }));
      });
  }
  
  updateBotChannels(bot) {
      var self = this;
      self.davisChannels.splice(0, this.davisChannels.length);
      bot.api.channels.list({}, function (err, response) {
          if (response.hasOwnProperty('channels') && response.ok) {
              var total = response.channels.length;
              for (var i = 0; i < total; i++) {
                  var channel = response.channels[i];
                  // Lets update the list with the channels davis is currently a member of
                  if (channel.is_member) self.davisChannels.push({name: channel.name, id: channel.id, bot: bot});
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