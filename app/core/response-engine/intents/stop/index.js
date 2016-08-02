'use strict';

const common = require('../../utils/common'),
    _ = require('lodash'),
    logger = require('../../../../utils/logger');

const process = function process(davis) {
    logger.info('Responding to a stop intent.');
    const response = ['OK, have a good one.', 'Talk to you later.', 'Bye!', 'See you later.'];
    common.addTextResponse(davis.exchange, _.sample(response));
    davis.exchange.request.finished = true;
};

module.exports.process = process;