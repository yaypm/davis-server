'use strict';

const _ = require('lodash'),
    logger = require('../../../../utils/logger');

const state = {
    default: (davis) => {
        logger.debug('We aren\'t able to push the URL anywhere');
        const state = {
            type: 'problemDetails',
            next: {
                yes: null,
                no: 'stop'
            }
        };
        davis.exchange.state = state;
        davis.exchange.response.finished = false;
        return _.sample(['Is there anything else I can help with?']);
    },

    openLink: (davis) => {
        const state = {
            type: 'problemDetails',
            url:  _.get(davis, 'intentData.problem.result.problems[0].id'),
            next: {
                send: null,
                yes: 'send',
                no: null
            }
        };
        davis.exchange.state = state;
        davis.exchange.response.finished = false;
        return _.sample(['Would you like for me to open this for you?']);
    }
};

module.exports = state;