'use strict';

const _ = require('lodash'),
    logger = require('../../../../utils/logger');

const state = {
    zeroProblems: (davis) => {
        logger.debug('Processing state zero');
        davis.exchange.response.finished = false;
        return 'What else can I do for you?';
    },

    oneProblem: (davis) => {
        logger.debug('Processing state one');
        const state = {
            type: 'oneProblem',
            problemId:  _.get(davis, 'intentData.problem.result.problems[0].id'),
            next: {
                yes: 'problemDetails',
                no: null
            }
        };
        davis.exchange.state = state;
        davis.exchange.response.finished = false;
        return 'Would you like me to analysis this further for you?';
    },

    twoProblems: (davis) => {
        logger.debug('Processing state two');
        const state = {
            type: 'twoProblems',
            problemIds:  [_.get(davis, 'intentData.problem.result.problems[0].id'), _.get(davis, 'intentData.problem.result.problems[1].id')],
            next: {
                multipleChoice: 'problemDetails',
                yes: 'problemDetails',
                no: null
            }
        };
        davis.exchange.state = state;
        davis.exchange.response.finished = false;
        return 'Would you like to know more about the first problem or the second one?';
    },

    manyProblems: (davis) => {
        logger.debug('Processing state many');
        davis.exchange.response.finished = true;
        return 'I would recommend either asking a more specific question or checking out the problem dashboard.';
    }
};

module.exports = state;