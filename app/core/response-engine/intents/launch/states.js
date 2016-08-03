'use strict';

const logger = require('../../../../utils/logger');

const state = {
    launch: (davis) => {
        logger.debug('Setting the launch state');
        davis.exchange.response.finished = false;
    }
};

module.exports = state;