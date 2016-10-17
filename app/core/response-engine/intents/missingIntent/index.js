'use strict';

const _ = require('lodash'),
    common = require('../../utils/common'),
    logger = require('../../../../utils/logger');

const process = function process(davis, intentName) {
    const message = `Oh no! The "${intentName}" intent is defined in Wit (Natural Language Processing Service), but not on the Davis server. To avoid this error in the future, make sure you're running the latest version of Davis by running "npm update" within davis-server and restarting the instance.`;
    common.addTextResponse(davis.exchange, message);
    davis.exchange.response.finished = true;
};

module.exports.process = process;