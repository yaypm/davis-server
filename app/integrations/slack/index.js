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
    
    /**
     * initConvo() is a recursive function that acts as a loop for continuing the conversation flow
     * 
     * @param response {Object}
     * @param convo {Object}
     */
    let initConvo = function (err, convo) {
        
        lastInteractionTime = moment();
    
        if (!initialInteraction.text.toLowerCase().includes('hey davis')) {
            
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
            
        } else {
            
            initialResponse = "Hi, my name's Davis, your virtual Dev-Ops assistant. What can I help you with today?";
            shouldEndSession = false;
            
            convo.ask(initialResponse, function (response, convo) {
                addToConvo(response, convo);
            });
            
            convo.next();
            
        }
        
    };
    
    let addToConvo = function (response, convo) {
        
        // Timeout of 30 seconds
        let isTimedOut = moment().subtract(30, 'seconds').isAfter(lastInteractionTime);
        
        // Reset last interaction timestamp
        lastInteractionTime = moment();
        
        // if exit, quit, or stop are mentioned, or lastInteractionTime is more than 30 seconds ago, end conversation
        if (shouldEndSession || isTimedOut) {
            
            logger.info('Stopped');
            convo.stop();
            
        } else {
            
            SlackService(config).askDavis(response)
            .then(resp => {
                
                logger.info('Sending a response back to the Slack service');
                
                shouldEndSession = resp.response.shouldEndSession;
                
                if (shouldEndSession) {
                    
                    convo.say(resp.response.outputSpeech.text);
                    convo.next();
                    
                } else {

                    // send reply and listen for next interaction
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
    
    controller.hears(['me'], 'direct_message,direct_mention', (bot, message) => {
        logger.info('direct mention of me');
        initialInteraction = message;
        bot.startPrivateConversation(message, initConvo);
    });
    
    controller.hears(['(.*)'], 'direct_message,direct_mention', (bot, message) => {
        logger.info('direct mention of anything');
        initialInteraction = message;
        bot.startConversation(message, initConvo);
    });
    
    controller.hears(['hey davis'], 'mention,ambient', (bot, message) => {
        logger.info('mention of hey davis');
        initialInteraction = message;
        bot.startConversation(message, initConvo);
    });
    
};