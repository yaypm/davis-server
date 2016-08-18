'use strict';

const _ = require('lodash'),
    BbPromise = require('bluebird'),
    common = require('../../utils/common'),
    logger = require('../../../../utils/logger');

const process = function process(davis) {
    logger.warn(`The user ran into an unknown intent when asking '${davis.exchange.request.text}'`);
    const responses = [
        'Unfortunately, I don\'t know how to respond to that yet.  However, pull requests are always welcome!',
        'I\'m sorry but I don\'t understand.',
        'I don\'t know how to respond to this... yet!'
    ];

    const helpResponses = [
        'I\'m still confused.  Would you like to know more about my current capabilities?',
        'I don\'t know what you mean.  Would you be interested in knowing about my area of expertise?',
        'Unfortunately, I still don\'t know what you mean.  Would you like some help taking advantage of my services?'
    ];

    const state = {
        type: 'unknown',
        next: {
            yes: 'help'
        }
    };

    return new BbPromise((resolve, reject) => {
        davis.conversation.getHistory(2)
            .then(result => {
                const previousIntent = _.head(result[1].intent);

                if (previousIntent === 'unknown') {
                    logger.debug('The user appears to be confused.  We should suggest a path.');

                    davis.exchange.state = state;
                    davis.exchange.request.finished = false;
                    common.addTextResponse(davis.exchange, _.sample(helpResponses));
                } else {
                    davis.exchange.request.finished = false;
                    common.addTextResponse(davis.exchange, _.sample(responses));
                }
                resolve(davis);
            })
            .catch(err => {
                logger.error(`Error loading the conversation history: ${err.message}`);
                return reject(err);
            });
    });
};

module.exports.process = process;