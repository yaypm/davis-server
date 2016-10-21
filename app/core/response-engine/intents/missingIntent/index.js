'use strict';

const _ = require('lodash'),
    common = require('../../utils/common'),
    logger = require('../../../../utils/logger');

const process = function process(davis, intentName) {
    const message = `Sorry, but I was unable to find the intent entitled "${intentName}". The intent is defined in Wit, but not on the Davis server. Make sure you're running the latest version of Davis by navigating to the davis-server directory. Next, run "npm update". Finally, restart the Davis server.`;
    common.addTextResponse(davis.exchange, message);
    davis.exchange.response.finished = true;
};

module.exports.process = process;