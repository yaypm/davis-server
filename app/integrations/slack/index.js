'use strict';

const Botkit = require('botkit'),
    BbPromise = require('bluebird'),
    logger = require('../../utils/logger'),
    SlackService = require('./services/SlackService'),
    rp = require('request-promise'),
    moment = require('moment');

module.exports = function (config) {
    
    const controller = Botkit.slackbot({
        debug: false,
        interactive_replies: true
    });
    
    let bot;
    const inactivityTimeoutTime = 30; // Seconds of inactivity until Davis goes to sleep
    
    // Launch phrases
    const phrases = [
        "hey davis",
        "okay davis",
        "ok davis",
        "hello davis",
        "hi davis"
    ];
    
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
            .then( (resp) => {
            
                resp.members.forEach( (member) => {
                    
                    if (member.id === userId) {
                        return resolve(member);
                    }
                    
                });
                
                resolve();
                
            }).catch(function (err) {
                reject(new Error(err));
            });
             
         });
         
    }
    
    /**
     * Get Davis bot online status
     * Important for making sure other another Davis instance isn't running a Slack bot already
     */
    let getDavisBotStatus = function () {
         return new BbPromise((resolve, reject) => {
            
            getUserDetails().then( (res) => {
             
                let options = {
                    uri: 'https://slack.com/api/users.getPresence?token=' + config.slack.key,
                    json: true
                };
             
                rp(options)
                .then( (respJson) => {
                    
                    return resolve(respJson.online);
                    
                }).catch( (err) => {
                    reject(new Error(err));
                });
            
            }).catch(err => {
                logger.error('Error in getUserDetails');
                logger.error(err);
            });
             
         });
    }
    
    // Check if bot is already running on another Davis instance
    getDavisBotStatus().then( (isOnline) => {
        
        if (!isOnline) {
            
            bot = controller.spawn({
                token: config.slack.key
            });
            
            bot.startRTM( (err, bot, payload) => {
                if (err) {
                    throw new Error('Could not connect to Slack');
                }
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
    let showTypingNotification = function (channel) {
        
        bot.say({
            type: "typing",
            channel: channel // a valid slack channel, group, mpim, or im ID
        });
        
    }
    
    controller.hears(['(.*)'], 'direct_message', (bot, message) => {
        
        logger.info('Slack: Starting public conversation (direct_message)');
        bot.startConversation(message, (err, convo) => {
            let slackConvo = new SlackConversation(message, true);
            slackConvo.initConvo(err, convo);
        });
        
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
            this.convoEnded = false;
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

            this.inactivityTimeout = this.setInactivityTimeout(convo);
            
            getUserDetails(this.initialInteraction.user).then( (details) => {
                
                this.user = details;
                
                // if not a direct message, use @username as message prefix
                if (!this.isDirectMessage) {
                    this.directPrefix = '@' + this.user.name + ' ';
                }
            
                // Strip launch phrase or set to a launch intent compatible phrase
                phrases.forEach( (phrase) => {
                            
                    if (this.initialInteraction.text.toLowerCase().includes(phrase)) {
                        
                        if (phrase.length == this.initialInteraction.text.trim().length) {
                            
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
                    
                    if (resp.response.outputSpeech.card) {
                        resp.response.outputSpeech.card.attachments[0].pretext = this.directPrefix + resp.response.outputSpeech.card.attachments[0].pretext;
                        this.initialResponse = resp.response.outputSpeech.card;
                    } else {
                        this.initialResponse = this.directPrefix + resp.response.outputSpeech.text;
                    }
                   
                    this.shouldEndSession = resp.response.shouldEndSession;
                    
                    // Listen for typing event
                    controller.on('user_typing', (bot,message) => {
                
                        if (message.user === this.user.id && this.inactivityTimeout && !this.convoEnded && !this.shouldEndSession) {
                            logger.info('Slack: User typing, resetting timeout');
                            this.lastInteractionTime = moment();
                            this.resetTimeout = true;
                        }  
                        
                    });
        
                    convo.ask(this.initialResponse, (response, convo) => {
                        clearTimeout(this.inactivityTimeout);
                        this.addToConvo(response, convo);
                    });
                    convo.next();
                    
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
    
            // Timeout of 60 seconds
            let isTimedOut = moment().subtract(inactivityTimeoutTime, 'seconds').isAfter(this.lastInteractionTime);
            
            // Reset last interaction timestamp
            this.lastInteractionTime = moment();
            
            this.inactivityTimeout = this.setInactivityTimeout(convo);
            
            // if lastInteractionTime is more than 30 seconds ago, end conversation
            if (!this.isDirectMessage && (this.shouldEndSession || isTimedOut)) {
                
                logger.info('Slack: Conversation stopped');
                convo.stop();
                this.convoEnded = true;
                clearTimeout(this.inactivityTimeout);
                
            } else {
                
                showTypingNotification(this.initialInteraction.channel);
                
                SlackService(config).askDavis(response, this.user)
                .then(resp => {
                    
                    logger.info('Slack: Sending a response');
                    
                    this.shouldEndSession = resp.response.shouldEndSession;
                    
                    // if no followup question
                    if (this.shouldEndSession) {
                        
                        convo.say(this.directPrefix + resp.response.outputSpeech.text);
                        convo.next();
                        clearTimeout(this.inactivityTimeout);
                        
                    } else {
    
                        // Send response and listen for request
                        convo.ask(resp.response.outputSpeech.card, (response, convo) => {
                        
                            this.addToConvo(response, convo);
                            
                        });
                        convo.next();
                        clearTimeout(this.inactivityTimeout);
                        
                    }
        
                })
                .catch(err => {
                    logger.error('Unable to respond to the request received from Slack');
                    logger.error(err);
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
                if(!this.isDirectMessage && !this.resetTimeout) {
                    
                    convo.say(this.directPrefix + ":ZZZ: I've fallen asleep");
                    convo.next();
                    this.convoEnded = true;
                    clearTimeout(this.inactivityTimeout);
                    
                    // Allows convo.say to execute beforehand
                    setTimeout( () => {
                        convo.stop()
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