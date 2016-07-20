'use strict';

const logger = require('../../../utils/logger');


module.exports.runIntent = function runIntent(intentName, davis) {
    logger.info(`Loading the ${intentName} intent`);
    try {
        //const intent = require(`./${intentName}`);
        const intent = require('./problem');
        return intent.process(davis);
    } catch (err) {
        return new Error(err);
    }
};