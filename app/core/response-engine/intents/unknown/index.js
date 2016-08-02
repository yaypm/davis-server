'use strict';

const common = require('../../utils/common'),
    _ = require('lodash'),
    logger = require('../../../../utils/logger');

const process = function process(davis) {
    logger.warn(`The user ran into an unknown intent when asking '${davis.exchange.request.text}`);
    const response = ['Unfortunately, I don\'t know how to response to that yet.  However, pull requests are always welcome!'];
    common.addTextResponse(davis.exchange, _.sample(response));
    davis.exchange.request.finished = true;
};

module.exports.process = process;