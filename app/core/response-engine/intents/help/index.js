'use strict';

const common = require('../../utils/common'),
    logger = require('../../../../utils/logger');


const process = function process(davis) {
    logger.warn('The user is asking for help');
    common.addTextResponse(davis.exchange, 'The help feature hasn\'t been fully implemented yet.');
    davis.exchange.request.finished = true;
};

module.exports.process = process;