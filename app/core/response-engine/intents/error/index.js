'use strict';

const _ = require('lodash'),
    common = require('../../utils/common'),
    logger = require('../../../../utils/logger');

const process = function process(davis, data) {
    const message = _.get(data, 'error.message', 'Something went wrong but I\'m not exactly sure what!');
    logger.warn(`Using the error intent to response with '${message}'.`);
    common.addTextResponse(davis.exchange, message);
    davis.exchange.request.finished = true;
};

module.exports.process = process;