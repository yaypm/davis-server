'use strict';

const _ = require('lodash'),
    BbPromise = require('bluebird'),
    intents = require('../'),
    logger = require('../../../../utils/logger');

const process = function process(davis) {
    return new BbPromise((resolve, reject) => {
        davis.conversation.getHistory(2)
            .then(result => {
                const nextIntent = _.get(result, '[1].state.next.yes', 'error'),
                    errorState = {error: { message: 'I\'m sorry but I don\'t know how to respond to that!' }};

                davis.exchange.intent.push(nextIntent);
                return intents.runIntent(nextIntent, davis, _.get(result, '[1].state', errorState));
            })
            .then(davis => {
                resolve(davis);
            })
            .catch(err => {
                logger.error(`Error loading the conversation history: ${err.message}`);
                return reject(err);
            });
    });
};

module.exports.process = process;