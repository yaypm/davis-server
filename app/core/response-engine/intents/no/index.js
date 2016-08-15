'use strict';

const _ = require('lodash'),
    BbPromise = require('bluebird'),
    intents = require('../'),
    common = require('../../utils/common'),
    logger = require('../../../../utils/logger');

const process = function process(davis) {
    logger.info('Responding to a no intent.');

    const responses = [
        'OK, no problem.  What else can I help you with?',
        'Sure thing!  Is there anything else I can help you with?',
        'OK, is there anything else?'
    ];

    const state = {
        type: 'no',
        next: {
            no: 'stop'
        }
    };

    return new BbPromise((resolve, reject) => {
        davis.conversation.getHistory(2)
            .then(result => {
                const previousIntent = _.get(result, '[1].state.type'),
                    nextRoute = _.get(result, '[1].state.next.no');

                if (previousIntent === 'no') {
                    logger.debug('We were just in the no intent');
                    const nextIntent = _.get(result, '[1].state.next.no');
                    davis.exchange.intent.push(nextIntent);
                    return intents.runIntent(nextIntent, davis);
                } else if (!_.isNil(nextRoute)) {
                    logger.debug('A no route has been defined');
                    davis.exchange.intent.push(nextRoute);
                    return intents.runIntent(nextRoute, davis);
                } else {
                    davis.exchange.state = state;
                    davis.exchange.request.finished = false;
                    return common.addTextResponse(davis.exchange, _.sample(responses));
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