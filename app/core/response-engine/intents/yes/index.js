'use strict';

const _ = require('lodash'),
    BbPromise = require('bluebird'),
    intents = require('../'),
    logger = require('../../../../utils/logger');

const process = function process(davis) {
    return new BbPromise(resolve => {
        davis.conversation.getHistory(2, function(err, result) {
            if (err) logger.error('Error loading conversation history');

            const nextIntent = _.get(result, '[1].state.next.yes', 'error');

            return resolve(intents.runIntent(nextIntent, davis, _.get(result, '[1].state')));
        });
    });
};

module.exports.process = process;