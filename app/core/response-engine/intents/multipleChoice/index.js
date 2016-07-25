'use strict';

const _ = require('lodash'),
    BbPromise = require('bluebird'),
    intents = require('../'),
    S = require('string'),
    logger = require('../../../../utils/logger');

const process = function process(davis) {
    logger.debug('Starting a multiple choice intent.');
    return new BbPromise(resolve => {
        davis.conversation.getHistory(2, function(err, result) {
            if (err) logger.error('Error loading conversation history');

            const nextIntent = _.get(result, '[1].state.next.mutlipleChoice', 'error'),
                state = {};

            if (nextIntent !== 'error') {
                let request = davis.exchange.request.text,
                    requestString = S(request);

                if (requestString.include('third') || requestString.include('three')) {
                    logger.debug('The user asked for the third choice');
                    state.problemId = result[1].state.problemIds[2];
                } else if (requestString.include('second') || requestString.include('two')) {
                    logger.debug('The user asked for the second choice');
                    state.problemId = result[1].state.problemIds[1];
                } else if (requestString.include('first') || requestString.include('one')) {
                    logger.debug('The user asked for the first choice');
                    state.problemId = result[1].state.problemIds[0];
                }
            }

            return resolve(intents.runIntent(nextIntent, davis, state));
        });
    });
};

module.exports.process = process;