'use strict';

const Botkit = require('botkit'),
    logger = require('../../utils/logger'),
    SlackService = require('./services/SlackService'),
    moment = require('moment');

module.exports = function (config) {
    
    const controller = Botkit.slackbot({
        debug: false,
        interactive_replies: true
    });
    
    controller.spawn({
        token: config.slack.key
    }).startRTM();
    
    let initialInteraction;
    let initialResponse;
    let lastInteractionTime;
    let shouldEndSession;
    
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
            
        SlackService(config).askDavis(initialInteraction)
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
        
        // Timeout of 60 seconds
        let isTimedOut = moment().subtract(60, 'seconds').isAfter(lastInteractionTime);
        
        // Reset last interaction timestamp
        lastInteractionTime = moment();
        
        // if lastInteractionTime is more than 30 seconds ago, end conversation
        if (shouldEndSession || isTimedOut) {
            
            logger.info('Slack: Conversation stopped');
            convo.stop();
            
        } else {
            
            SlackService(config).askDavis(response)
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
    
    controller.hears(['(.*)'], 'direct_message,direct_mention', (bot, message) => {
        logger.info('Slack: Starting public conversation (direct)');
        initialInteraction = message;
        bot.startConversation(message, initConvo);
    });
    
    controller.hears(phrases, 'mention,ambient', (bot, message) => {
        logger.info('Slack: Starting public conversation (ambient)');
        initialInteraction = message;
        bot.startConversation(message, initConvo);
    });
    
};