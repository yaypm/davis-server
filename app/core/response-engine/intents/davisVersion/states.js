'use strict';

const logger = require('../../../../utils/logger');

const state = {
    davisVersion: (davis) => {
        logger.debug('Setting the davisVersion state');
        davis.exchange.response.finished = true;
    }
};

module.exports = state;