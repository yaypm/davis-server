'use strict';

const BbPromise = require('bluebird'),
    _ = require('lodash'),
    common = require('../../utils/common'),
    logger = require('../../../../utils/logger');

const process = function process(davis, data) {
    common.addTextResponse(davis.exchange, 'Something went wrong!');
    return;
}

module.exports.process = process;