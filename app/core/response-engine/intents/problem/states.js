'use strict';

const _ = require('lodash'),
    logger = require('../../../../utils/logger');

const state = {
    zeroProblems: (davis) => {
        logger.debug('Processing state zero');
        return;
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
    },

    manyProblems: (davis) => {
        logger.debug('Processing state many');
        return;
    }
}

module.exports = state;