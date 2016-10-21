'use strict';

const _ = require('lodash'),
    url = require('../../utils/url'),
    logger = require('../../../../utils/logger');

const state = {
    zeroProblems: (davis) => {
        logger.debug('Processing state zero');
        davis.exchange.state = {
            type: 'zeroProblems',
            next: {
                yes: null,
                no: 'stop'
            }
        };
        davis.exchange.response.finished = false;
        return _.sample(['What else can I do for you?', 'Is there anything else I can help you with?',  'Is there anything else you need?', 'What else can I help you with?']);
    },

    oneProblem: (davis) => {
        logger.debug('Processing state one');
        davis.exchange.state = {
            type: 'oneProblem',
            problemId:  _.get(davis, 'intentData.latestProblem.result.problems[0].id'),
            url:  url.topImpactURL(davis.user, davis.intentData.latestProblem.result.problems[0]),
            next: {
                send: null,
                yes: 'problemDetails',
                no: null
            }
        };
        davis.exchange.response.finished = false;
        return 'Would you like me to analyze this further for you?';
    }
};

module.exports = state;