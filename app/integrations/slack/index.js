'use strict';

const Botkit = require('botkit'),
    logger = require('../../utils/logger');

const controller = Botkit.slackbot({
    debug: false
});

module.exports = function(config) {

    controller.spawn({
        token: config.slack.key
    }).startRTM();


    let initConvo = function (response, convo) {

        let initialResponse = "";

        if (!initialResponse) {
            initialResponse = "Hi, my name's Davis, your virtual Dev-Ops assassin. What can I help you with today?";
        }

        convo.ask(initialResponse, function (response, convo) {

            var lastInteractionTime = new Date();

            var addToConvo = function (response, convo) {

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

                    // get reply string from existing backend here based on response string
                    let reply = "Hello world!";

                    // Send reply and listen for next interaction
                    convo.ask(reply, function (response, convo) {

                        // Reset last interaction timestamp
                        lastInteractionTime = new Date();

                        // Recursive function that acts as a loop for continuing the conversation flow
                        addToConvo(response, convo);

                    });
                    convo.next();

                }

            };

            addToConvo(response, convo);

        });
        convo.next();

    };

    controller.hears(['me'], 'direct_message,direct_mention', (bot, message) => {
        logger.info('direct mention of me');
        bot.startPrivateConversation(message, initConvo);
    });

    controller.hears(['(.*)'], 'direct_message,direct_mention', (bot, message) => {
        logger.info('direct mention of anything');
        bot.startConversation(message, initConvo);
    });

    controller.hears(['hey davis'], 'mention,ambient', (bot, message) => {
        logger.info('mention of hey davis');
        bot.startConversation(message, initConvo);
    });
};

