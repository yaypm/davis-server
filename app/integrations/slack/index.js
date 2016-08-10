'use strict';

const Botkit = require('botkit'),
    logger = require('../../utils/logger'),
    SlackService = require('./services/SlackService'),
    fetch = require('node-fetch'),
    moment = require('moment');

module.exports = function (config) {
    
    const controller = Botkit.slackbot({
        debug: false,
        interactive_replies: true
    });
    
    var bot = controller.spawn({
        token: config.slack.key
    });
    
    bot.startRTM(function (err, bot, payload) {
        if (err) {
            throw new Error('Could not connect to Slack');
        }
    });
    
    let initialInteraction;
    let initialResponse;
    let lastInteractionTime;
    let shouldEndSession;
    let user;
    
    // Launch phrases
    let phrases = [
        "hey davis",
        "okay davis",
        "ok davis",
        "k davis", 
        "hello davis",
        "hi davis"
    ];
    
    /**
     * initConvo() is a recursive function that acts as a loop for continuing the conversation flow
     * 
     * @param response {Object}
     * @param convo {Object}
     */
    let initConvo = function (err, convo) {
        
        showTypingNotification();
        
        lastInteractionTime = moment();
        
        phrases.forEach(function (phrase) {
                    
            if (initialInteraction.text.toLowerCase().includes(phrase)) {
                
                if (phrase.length == initialInteraction.text.trim().length) {
                    initialInteraction.text = 'Start davis';
                } else {
                    initialInteraction.text = initialInteraction.text.toLowerCase().replace(phrase, '');
                }
                
            }
            
        });
            
        SlackService(config).askDavis(initialInteraction, user)
        .then(resp => {
            
            logger.info('Sending a response back to the Slack service');
            initialResponse = resp.response.outputSpeech.text;
            shouldEndSession = resp.response.shouldEndSession;

            convo.ask(initialResponse, function (response, convo) {
                addToConvo(response, convo);
            });
            convo.next();
            
        })
        .catch(err => {
            //ToDo add an error response.
            logger.error('Unable to respond to the request received from Slack');
            logger.error(err);
        });
        
    };
    
    let addToConvo = function (response, convo) {
        
        showTypingNotification();

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
                    convo.ask(resp.response.outputSpeech.text, function (response, convo) {
                    
                        addToConvo(response, convo);
                        
                    });
                    convo.next();
                    
                }
    
            })
            .catch(err => {
                //ToDo add an error response.
                logger.error('Unable to respond to the request received from Slack');
                logger.error(err);
            });
            
        }
        
    };
    
    let startConvo = function (bot, message, newConvo) {
        
        // Get Slack user details (for timezone)
        if (!user || !newConvo) {
            var options = {
                method: 'get',
                headers: {
                  accept: 'application/json'
                }
            };
            
            fetch('https://slack.com/api/users.list?token='+config.slack.key, options)
            .then(function (response) {
                
                return response.json();
                
            }).then(function (resp) {
            
                resp.members.forEach(function (member) {
                   
                    if (member.id.toLowerCase() === initialInteraction.user.toLowerCase()) {
                        
                        user = member;
                        
                        if (newConvo) {
                            bot.startConversation(message, initConvo);
                        }
                        
                    }   
                    
                });
                
            }).catch(function (err) {
                console.log(err);
            });
        
        } else {
            
            bot.startConversation(message, initConvo);
            
        }
        
    }
    
    let showTypingNotification = function () {
        
        setTimeout(function () {
            
            bot.say({
                type: "typing",
                channel: initialInteraction.channel // a valid slack channel, group, mpim, or im ID
            });
            
        }, 500);
        
    }
    
    controller.hears(['(.*)'], 'direct_message,direct_mention', (bot, message) => {
        logger.info('Slack: Starting public conversation (direct)');
        initialInteraction = message;
        startConvo(bot, message, true);
    });
    
    controller.hears(phrases, 'mention,ambient', (bot, message) => {
        logger.info('Slack: Starting public conversation (ambient)');
        initialInteraction = message;
        startConvo(bot, message, true);
    });
    
    controller.on('user_channel_join',function(bot,message) {
        startConvo(bot, message, false);
    });
    
};