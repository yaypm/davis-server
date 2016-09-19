'use strict';

const Botkit = require('botkit'),
    _ = require('lodash'),
    BbPromise = require('bluebird'),
    logger = require('../../utils/logger'),
    SlackService = require('./services/SlackService'),
    problemService = require('../../services/events/problemService'),
    ConversationService = require('../../services/ConversationService'),
    Davis = require('../../core'),
    rp = require('request-promise'),
    moment = require('moment');

const davisChannels = [];
const inactivityTimeoutTime = 30; // Seconds of inactivity until Davis goes to sleep
const ERROR_MESSAGE = 'Sorry about that, I\'m having issues responding to your request at this time.';
const DAVIS_SLEEP_MESSAGE = ['Wake me up if you need something!  :sleeping:', 'I\'ve gone to sleep. :ZZZ:', 'Until next time :spock-hand:'];

// Launch phrases
const phrases = [
    'hey davis',
    'hey, davis',
    'okay davis',
    'okay, davis',
    'ok davis',
    'ok, davis',
    'davis'
];

module.exports = function (config) {
    let bot;

    const controller = Botkit.slackbot({
        debug: false,
        interactive_replies: true
    });

    /**
     * Gets user details
     * Important for using correct timezone and finding the davis bot's id
     * 
     * @param {String} userId - user specific identifier provided by Slack
     */
    let getUserDetails = function (userId) {
        return new BbPromise((resolve, reject) => {
             
            let options = {
                uri: 'https://slack.com/api/users.list?token='+config.slack.key,
                json: true
            };

            rp(options)
                .then(resp => {
                    resp.members.forEach( (member) => {
                        if (member.id === userId) {
                            return resolve(member);
                        }
                    });
                    resolve();
                }).catch(err => {
                    reject(err);
                });
        });
    };
    
    /**
     * Get Davis bot online status
     * Important for making sure other another Davis instance isn't running a Slack bot already
     */
    let getDavisBotStatus = function () {
        return new BbPromise((resolve, reject) => {
            getUserDetails()
                .then(() => {
                    return rp({
                        uri: 'https://slack.com/api/users.getPresence?token=' + config.slack.key,
                        json: true
                    });
                })
                .then(resp => {
                    resolve(resp.online);
                })
                .catch(err => {
                    logger.error('Error in getUserDetails');
                    reject(err);
                });
        });
    };
    
    // Check if bot is already running on another Davis instance
    getDavisBotStatus()
        .then(isOnline => {
            if (!isOnline) {
                bot = controller.spawn({
                    token: config.slack.key
                });

                bot.startRTM(err => {
                    if (err) {
                        throw new Error('Could not connect to Slack');
                    }
                    updateBotChannels();
                });
            } else {
                logger.warn('Failed to start Slack bot. A Slack bot may already be running on another instance of Davis using the same API key');
            }
        }).catch(err => {
            logger.error('Error in getDavidBotStatus');
            logger.error(err);
        });
    
    /**
     * Makes Slack display that Davis is typing a message (similar to processing in web UI)
     */ 
    const showTypingNotification = function (channel) {
        bot.say({
            type: 'typing',
            channel: channel
        });
    };

    const updateBotChannels = function () {
        davisChannels.splice(0, davisChannels.length);
        bot.api.channels.list({}, function (err, response) {
            if (response.hasOwnProperty('channels') && response.ok) {
                var total = response.channels.length;
                for (var i = 0; i < total; i++) {
                    var channel = response.channels[i];
                    // Lets update the list with the channels davis is currently a member of
                    if (channel.is_member) davisChannels.push({name: channel.name, id: channel.id});
                }
            }
        });
    };

    controller.hears(['(.*)'], 'direct_message', (bot, message) => {
        // Slack sends a direct message to a bot when they're removed from a channel
        if(message.text.startsWith('You have been removed from')) {
            logger.info('Oh no!  Davis was removed a channel!');
            updateBotChannels();
        } else {
            logger.info('Slack: Starting public conversation (direct_message)');
            bot.startConversation(message, (err, convo) => {
                let slackConvo = new SlackConversation(message, true);
                slackConvo.initConvo(err, convo);
            });
        }
    });
    
    controller.hears(['(.*)'], 'direct_mention', (bot, message) => {
        logger.info('Slack: Starting public conversation (direct_mention)');
        bot.startConversation(message, (err, convo) => {
            let slackConvo = new SlackConversation(message, false);
            slackConvo.initConvo(err, convo);
        });
        
    });
    
    controller.hears(phrases, 'mention,ambient', (bot, message) => {

        logger.info('Slack: Starting public conversation (mention,ambient)');
        bot.startConversation(message, (err, convo) => {
            let slackConvo = new SlackConversation(message, false);
            slackConvo.initConvo(err, convo);
        });
        
    });

    controller.on('bot_channel_join', (bot, message) => {
        updateBotChannels();
        bot.say(
            {
                text: 'Thanks for the invite!  Message me if you need anything.',
                channel: message.channel
            }
        );
    });

    controller.on('rtm_close',function() {
        // We could consider adding some retry logic here
        logger.warn('The RTM connection was closed for some reason!');
    });

    if (_.get(config, 'slack.notifications.alerts.enabled', false)) {
        logger.info('Problem notifications in Slack has been enabled');
        problemService.on('event.problem.*', problem => {
            logger.debug(`A problem notification for ${problem.PID} has been received.`);
            _.each(davisChannels, channel => {
                let foundMatch = false;
                _.some(_.get(config, 'slack.notifications.alerts.channels', []), subscribedChannel => {
                    //Making sure the friendly channel names match
                    if (subscribedChannel.name.toLowerCase() === channel.name.toLowerCase()) {
                        // Making sure the channel is interested in this state
                        if (_.includes(subscribedChannel.state, problem.State.toLowerCase())) {
                            //making sure the channel is interested in this impact
                            if (_.includes(subscribedChannel.impact, problem.ProblemImpact.toLowerCase())) {
                                // Making sure at least one tag matches if tags were defined
                                if (subscribedChannel.tags.includes.length === 0 || _.intersection(problem.Tags, subscribedChannel.tags.includes).length > 0) {
                                    // Making sure no tags match on the exclude list
                                    if (_.intersection(problem.Tags, subscribedChannel.tags.excludes).length === 0) {
                                        foundMatch = true;
                                    }
                                }
                            }
                        }
                    }
                });

                if (foundMatch) {
                    logger.info(`Push an alert to ${channel.name}`);
                    let user = {
                        id: 'davis-system',
                        nlp: config.nlp,
                        dynatrace: config.slack.dynatrace,
                        timezone: 'UTC'
                    };

                    ConversationService.getConversation(user)
                        .then(conversation => {
                            logger.info('conversation started');
                            let davis = new Davis(user, conversation, config);
                            return davis.process('problemDetails', {problemId: problem.PID});
                        })
                        .then(davis => {
                            logger.info('Finished processing request');
                            let response;
                            if (davis.exchange.response.visual.card) {
                                response = davis.exchange.response.visual.card;
                            } else {
                                response = davis.exchange.response.visual.text;
                            }
                            response.channel = channel.id;
                            bot.say(response);
                        })
                        .catch(err => {
                            logger.error(`Unable to push alert.  ${err.message}`);
                        });
                }
            });
        });
    }
    
    /**
     * Slack conversation
     * Interacts with botkit to allow conversation flow within Slack
     */
    class SlackConversation {
        
        constructor(message, isDirectMessage) {
            this.initialInteraction = message;
            this.isDirectMessage = isDirectMessage;
            this.initialResponse;
            this.lastInteractionTime;
            this.inactivityTimeout;
            this.resetTimeout = false;
            this.shouldEndSession;
            this.user;
            this.directPrefix = '';
        }
            
        /**
         * Initializes Slack conversation
         * 
         * @param err {Object} - error(s)
         * @param convo {Object} - conversation created by botkit
         */
        initConvo(err, convo) {
            
            showTypingNotification(this.initialInteraction.channel);
            
            this.lastInteractionTime = moment();

            if (this.shouldEndSession != true) {
                this.inactivityTimeout = this.setInactivityTimeout(convo);
            } else {
                clearTimeout(this.inactivityTimeout);
            }
            
            getUserDetails(this.initialInteraction.user).then( (details) => {
                
                this.user = details;
                
                // if not a direct message, use @username as message prefix
                if (!this.isDirectMessage) {
                    this.directPrefix = '@' + this.user.name + ' ';
                }
            
                // Strip launch phrase or set to a launch intent compatible phrase
                phrases.forEach( (phrase) => {
                            
                    if (this.initialInteraction.text.toLowerCase().includes(phrase)) {
                        
                        if (phrase.length === this.initialInteraction.text.trim().length) {
                            // Only a launch phrase detected, use launch intent compatible phrase
                            this.initialInteraction.text = 'Start davis';
                        } else {
                            // Strip launch phrase
                            this.initialInteraction.text = this.initialInteraction.text.toLowerCase().replace(phrase, ''); // Remove phrase
                            this.initialInteraction.text = this.initialInteraction.text.replace(/(^\s*,)|(,\s*$)/g, ''); // Remove leading/trailing white-space and commas
                        }
                    }
                });
                    
                    
                SlackService(config).askDavis(this.initialInteraction, this.user)
                .then(resp => {
                    
                    logger.info('Sending a response back to the Slack service');
                    if (this.directPrefix && resp.response.outputSpeech.card) {
                        resp.response.outputSpeech.card.text = this.directPrefix + resp.response.outputSpeech.card.text;
                        this.initialResponse = resp.response.outputSpeech.card;
                    } else if (this.directPrefix) {
                        resp.response.outputSpeech.text = this.directPrefix + resp.response.outputSpeech.text;
                        this.initialResponse = resp.response.outputSpeech.text;
                    } else {
                        this.initialResponse = (resp.response.outputSpeech.card) ? resp.response.outputSpeech.card : resp.response.outputSpeech.text;
                    }
                    
                    this.shouldEndSession = resp.response.shouldEndSession;
                    
                    // Listen for typing event
                    controller.on('user_typing', (bot,message) => {
                
                        if (message.user === this.user.id && this.inactivityTimeout && !this.shouldEndSession) {
                            this.lastInteractionTime = moment();
                            this.resetTimeout = true;
                        } else {
                            this.resetTimeout = false;
                        }  
                        
                    });
        
                    try{
                        
                        if (this.initialResponse) {
                            
                            convo.ask(this.initialResponse, (response, convo) => {
                                clearTimeout(this.inactivityTimeout);
                                this.addToConvo(response, convo);
                            });
                            
                        } else {
                            convo.say(ERROR_MESSAGE);
                        }
                        
                        convo.next();
                    
                    } catch (err) {
                        logger.warn(err);
                    }
                })
                .catch(err => {
                    logger.error('Unable to respond to the request received from Slack');
                    logger.error(err);
                });
            
            });
            
        }

        /**
         * Recursive method that responds to a request and tells Slack when 
         * the conversation should continue (convo.ask) or end (convo.say, convo.stop)
         * 
         * @param {String} response - text to be sent to user in response to request
         * @param {Object) convo - conversation object created by botkit
         */
        addToConvo(response, convo) {

            let isTimedOut = moment().subtract(inactivityTimeoutTime, 'seconds').isAfter(this.lastInteractionTime);
            
            // Reset last interaction timestamp
            this.lastInteractionTime = moment();
            
            if (this.shouldEndSession != true) {
                this.inactivityTimeout = this.setInactivityTimeout(convo);
            } else {
                clearTimeout(this.inactivityTimeout);
            }
            
            // if lastInteractionTime is more than 30 seconds ago, end conversation
            if (!this.isDirectMessage && (this.shouldEndSession || isTimedOut)) {
                
                logger.info('Slack: Conversation stopped');
                convo.stop();
                clearTimeout(this.inactivityTimeout);
                
            } else {
                
                showTypingNotification(this.initialInteraction.channel);
                   
                SlackService(config).askDavis(response, this.user)
                .then(resp => {
                    
                    logger.info('Slack: Sending a response');
                    if (this.directPrefix && resp.response.outputSpeech.card) {
                        resp.response.outputSpeech.card.text = this.directPrefix + resp.response.outputSpeech.card.text;
                    } else if (this.directPrefix) {
                        resp.response.outputSpeech.text = this.directPrefix + resp.response.outputSpeech.text;
                    }
                    
                    this.shouldEndSession = resp.response.shouldEndSession;
                    let output = (resp.response.outputSpeech.card) ? resp.response.outputSpeech.card : resp.response.outputSpeech.text;
                    
                    if (!output) {
                        throw new Error('Unable to respond, probably a template error');
                    }
                    
                    // if no followup question
                    if (this.shouldEndSession) {
                        convo.say(output);
                        convo.next();
                        clearTimeout(this.inactivityTimeout);
                    } else {
                        try{
                            // Send response and listen for request
                            convo.ask(output, (response, convo) => {
                            
                                if (output) {
                                    this.addToConvo(response, convo);
                                } else {
                                    convo.say(ERROR_MESSAGE);
                                    convo.next();
                                }
                            });
                            convo.next();
                        } catch (err) {
                            logger.warn(err);
                        }
                        clearTimeout(this.inactivityTimeout);
                    }
                })
                .catch(err => {
                    logger.error('Unable to respond to the request received from Slack');
                    logger.error(err);
                    convo.say(ERROR_MESSAGE);
                    convo.next();
                });
                
            }
            
        }
        
        /**
         * Recursive method that alerts the user when they've been inactive 
         * for 30 seconds if they're not in direct message mode
         * 
         * @param {Object} convo - conversation object created by botkit
         */
        setInactivityTimeout(convo) {
            
            // Inactivity timeout message sender
            return setTimeout( () => {
                
                // if not a direct message, let the user know they need to wake Davis
                if(!this.isDirectMessage && !this.resetTimeout && !this.shouldEndSession) {
                    
                    convo.say(this.directPrefix + _.sample(DAVIS_SLEEP_MESSAGE));
                    convo.next();
                    clearTimeout(this.inactivityTimeout);
                    
                    // Allows convo.say to execute beforehand
                    setTimeout( () => {
                        convo.stop();
                    }, 1000);
                    
                } else {
                    
                    this.resetTimeout = false;
                    clearTimeout(this.inactivityTimeout);
                    this.inactivityTimeout = this.setInactivityTimeout(convo);
                }
            }, inactivityTimeoutTime * 1000);
        }
    }
};