'use strict';

const logger = require('../../../../utils/logger');

const state = {
    default: (davis) => {
        logger.debug('Processing state zero');
        davis.exchange.response.finished = true;
    }
};

module.exports = state;