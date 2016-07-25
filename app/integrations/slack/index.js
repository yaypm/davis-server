'use strict';

const Botkit = require('botkit'),
    logger = require('../../utils/logger'),
    SlackService = require('./services/SlackService');

module.exports = function (config) {
    
    const controller = Botkit.slackbot({
        debug: false
    });
    
    controller.spawn({
        token: config.slack.key
    }).startRTM();
    
    var initialInteraction;
    let initialResponse;
    var lastInteractionTime;
    
    /**
     * initConvo() is a recursive function that acts as a loop for continuing the conversation flow
     * 
     * @param response {Object}
     * @param convo {Object}
     */
    let initConvo = function (err, convo) {
        
        lastInteractionTime = new Date();
    
        if (!initialInteraction.text.includes('hey davis')) {
            
                SlackService(config).askDavis(initialInteraction)
                .then(resp => {
                    
                    logger.info('Sending a response back to the Slack service');
                    
                    console.log('resp: '+JSON.stringify(resp));
                   initialResponse = resp.response.outputSpeech.text;

                    convo.ask(initialResponse, function (response, convo) {
                        console.log('response: '+JSON.stringify(response));
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
            convo.ask(initialResponse, function (response, convo) {
                console.log('response: '+JSON.stringify(response));
                addToConvo(response, convo);
            });
            convo.next();
            
        }
        
    };
    
    let addToConvo = function (response, convo) {
        
        let isTimedOut = lastInteractionTime < new Date((new Date) * 1 - 1000 * 600);
        
        // if exit, quit, or stop are mentioned, or lastInteractionTime is more than 10 minutes ago, end conversation
        if (response.text.includes("exit") || response.text.includes("quit") || response.text.includes("stop") || isTimedOut) {
            
            logger.info('Stopped');
            
            if (!isTimedOut) {
                
                convo.say("Goodbye!");
                convo.next();
                
            } else {
                convo.stop();
            }
            
        } else {
            
            SlackService(config).askDavis(response)
            .then(resp => {
                logger.info('Sending a response back to the Slack service');
                
                console.log('resp: '+JSON.stringify(resp));
                
                // send reply and listen for next interaction
                convo.ask(resp.response.outputSpeech.text, function (response, convo) {
                    
                    // reset last interaction timestamp
                    lastInteractionTime = new Date();
                
                    addToConvo(response, convo);
                    
                });
                convo.next();
    
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