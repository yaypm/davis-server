'use strict';

const _ = require('lodash'),
    logger = require('../../../../utils/logger');

const state = {
    general: (davis) => {
        logger.debug('General response');
        davis.exchange.state = {
            type: 'userActivity',
            next: {
                yes: null,
                no: 'stop'
            }
        };
        davis.exchange.response.finished = false;
        return _.sample(['What else can I do for you?', 'Is there anything else I can help you with?',  'Is there anything else you need?', 'What else can I help you with?']);
    }
};

module.exports = state;