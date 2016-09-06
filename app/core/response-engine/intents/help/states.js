'use strict';

const logger = require('../../../../utils/logger');

const state = {
    help: (davis) => {
        logger.debug('Setting the help state');
    }
};

module.exports = state;