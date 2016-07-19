'use strict';

const Botkit = require('botkit'),
    config = require('config'),
    logger = require('../../utils/logger');

const controller = Botkit.slackbot({
    debug: false
});

controller.spawn({
    token: 'xoxb-58758108581-uefRQxW6xyTeejPZa4Sbj54N'
}).startRTM();

controller.hears(['hey davis'], ['direct_message','direct_mention','mention'], (bot, message) => {
    logger.info('Someone is talking to me!');
    //setTimeout(() => {bot.reply(message, 'Hello!');}, 3000);
    bot.reply(message, 'Hello!');
});