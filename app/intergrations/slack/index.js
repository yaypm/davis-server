'use strict';

const Botkit = require('botkit'),
    logger = require('../../utils/logger');

const controller = Botkit.slackbot({
    debug: false
});

controller.spawn({
    token: 'xoxb-58758108581-uefRQxW6xyTeejPZa4Sbj54N'
}).startRTM();

controller.hears(['hey davis'], ['direct_message','direct_mention','mention'], (bot, message) => {
    logger.info('Someone is talking to me!');
    bot.reply(message, 'Hello!');
});