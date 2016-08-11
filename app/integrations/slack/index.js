'use strict';

const Botkit = require('botkit'),
    BbPromise = require('bluebird'),
    logger = require('../../utils/logger'),
    SlackService = require('./services/SlackService'),
    fetch = require('node-fetch'),
    moment = require('moment');

module.exports = function (config) {
    
    const controller = Botkit.slackbot({
        debug: false,
        interactive_replies: true
    });
    
    let initialInteraction;
    let initialResponse;
    let lastInteractionTime;
    let shouldEndSession;
    let user;
    let bot;
    let botId;
    
    // Launch phrases
    let phrases = [
        "hey davis",
        "okay davis",
        "ok davis",
        "hello davis",
        "hi davis"
    ];
    
    // Fetch options
    var options = {
        method: 'get',
        headers: {
          accept: 'application/json'
        }
    };
    
    /**
     * Gets user details
     * Important for using correct timezone and finding the davis bot's id
     * 
     * @param {String} userId - user specific identifier provided by Slack
     */
    let getUserDetails = function (userId) {
        
         return new BbPromise((resolve, reject) => {
             
            fetch('https://slack.com/api/users.list?token='+config.slack.key, options)
            .then( (response) => {
                
                return response.json();
                
            }).then( (resp) => {
            
                resp.members.forEach( (member) => {
                    
                    if (member.id === userId) {
                        return resolve(member);
                    } else if (member.name.includes('davis') && member.is_bot) {
                        botId = member.id;
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
             
                fetch('https://slack.com/api/users.getPresence?token=' + config.slack.key + '&user=' + botId, options)
                .then( (response) => {
                    
                    return response.json();
                    
                }).then( (respJson) => {
                    
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
     * initConvo() is a recursive function that acts as a loop for continuing the conversation flow
     * 
     * @param response {Object}
     * @param convo {Object}
     */
    let initConvo = function (err, convo) {
        
        showTypingNotification();
        
        lastInteractionTime = moment();
        
        phrases.forEach( (phrase) => {
                    
            if (initialInteraction.text.toLowerCase().includes(phrase)) {
                
                if (phrase.length == initialInteraction.text.trim().length) {
                    initialInteraction.text = 'Start davis';
                } else {
                    initialInteraction.text = initialInteraction.text.toLowerCase().replace(phrase, ''); // Remove phrase
                    initialInteraction.text = initialInteraction.text.replace(/(^\s*,)|(,\s*$)/g, ''); // Remove leading/trailing white-space and commas
                }
                
            }
            
        });
            
        SlackService(config).askDavis(initialInteraction, user)
        .then(resp => {
            
            logger.info('Sending a response back to the Slack service');
            initialResponse = resp.response.outputSpeech.text;
            shouldEndSession = resp.response.shouldEndSession;

            convo.ask(initialResponse, (response, convo) => {
                addToConvo(response, convo);
            });
            convo.next();
            
        })
        .catch(err => {
            logger.error('Unable to respond to the request received from Slack');
            logger.error(err);
        });
        
    };
    
    /**
     * Recursive function that responds to a request and tells Slack when the conversation should continue (convo.ask) or end (convo.say)
     */ 
    let addToConvo = function (response, convo) {

        // Timeout of 60 seconds
        let isTimedOut = moment().subtract(60, 'seconds').isAfter(lastInteractionTime);
        
        // Reset last interaction timestamp
        lastInteractionTime = moment();
        
        // if lastInteractionTime is more than 30 seconds ago, end conversation
        if (shouldEndSession || isTimedOut) {
            
            logger.info('Slack: Conversation stopped');
            convo.stop();
            bot.destroy.bind(bot);
            
        } else {
            
            showTypingNotification();
            
            SlackService(config).askDavis(response, user)
            .then(resp => {
                
                logger.info('Slack: Sending a response');
                
                shouldEndSession = resp.response.shouldEndSession;
                
                // if no followup question
                if (shouldEndSession) {
                    
                    convo.say(resp.response.outputSpeech.text);
                    convo.next();
                    
                } else {

                    // Send response and listen for request
                    convo.ask(resp.response.outputSpeech.text, (response, convo) => {
                    
                        addToConvo(response, convo);
                        
                    });
                    convo.next();
                    
                }
    
            })
            .catch(err => {
                logger.error('Unable to respond to the request received from Slack');
                logger.error(err);
            });
            
        }
        
    };
    
    let startConvo = function (bot, message) {
        
        // Get Slack user details (for timezone)
        if (!user) {
            
            getUserDetails(message.user)
            .then( (details) => { 
                
                user = details;
                bot.startConversation(message, initConvo);
                
            }).catch(err => {
                logger.error('Error in getUserDetails');
                logger.error(err);
            });
    
        } else {
            
            bot.startConversation(message, initConvo);
            
        }
        
    }
    
    let showTypingNotification = function () {
        
        setTimeout( () => {
            
            bot.say({
                type: "typing",
                channel: initialInteraction.channel // a valid slack channel, group, mpim, or im ID
            });
            
        }, 500);
        
    }
    
    controller.hears(['(.*)'], 'direct_message,direct_mention', (bot, message) => {
        
        logger.info('Slack: Starting public conversation (direct)');
        initialInteraction = message;
        startConvo(bot, message);
        
    });
    
    controller.hears(phrases, 'mention,ambient', (bot, message) => {
        
        logger.info('Slack: Starting public conversation (ambient)');
        initialInteraction = message;
        startConvo(bot, message);
        
    });
    
    controller.on('user_channel_join', (bot,message) => {
        
        logger.info('Slack: User joined channel, updating user details')
        getUserDetails(message.user)
        .then( (member) => {
            user = member;  
        }).catch(err => {
            logger.error('Error in getUserDetails');
            logger.error(err);
        });
        
    });
    
};