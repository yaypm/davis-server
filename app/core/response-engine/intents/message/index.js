'use strict';

const _ = require('lodash'),
    common = require('../../utils/common'),
    logger = require('../../../../utils/logger');

const process = function process(davis, data) {
    const message = _.get(data, 'message', 'I have so much to say but I don\'t know where to start!');
    logger.info(`Responding to the user with the following message '${message}'.`);
    common.addTextResponse(davis.exchange, message);
    davis.exchange.response.finished = _.get(data, 'finished', true);
};

module.exports.process = process;