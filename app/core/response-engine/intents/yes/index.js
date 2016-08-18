'use strict';

const _ = require('lodash'),
    BbPromise = require('bluebird'),
    intents = require('../'),
    common = require('../../utils/common'),
    logger = require('../../../../utils/logger');

const process = function process(davis) {
    return new BbPromise((resolve, reject) => {
        davis.conversation.getHistory(2)
            .then(result => {

                const nextIntent = _.get(result, '[1].state.next.yes', 'error'),
                    errorState = {error: { message: 'I\'m sorry but I don\'t know how to respond to that!' }};

                if (_.isNull(nextIntent)) {
                    logger.debug('The user said yes but not to a routing question');
                    davis.exchange.state = {
                        type: 'yes',
                        next: {
                            no: 'stop'
                        }
                    };
                    davis.exchange.request.finished = false;
                    return common.addTextResponse(davis.exchange, _.sample(['OK, great!  What would you like to know?', 'Awesome!  What can I help with?']));
                } else {
                    davis.exchange.intent.push(nextIntent);
                    if (nextIntent === 'error') {
                        return intents.runIntent(nextIntent, davis, errorState);
                    } else {
                        return intents.runIntent(nextIntent, davis, _.get(result, '[1].state', errorState));
                    }
                }
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