'use strict';

const common = require('../../utils/common'),
    logger = require('../../../../utils/logger');

const process = function process(davis) {
    logger.info('Responding to a no intent.');
    common.addTextResponse(davis.exchange, 'OK, no problem.  What else can I help you with?');
    davis.exchange.request.finished = false;
};

module.exports.process = process;