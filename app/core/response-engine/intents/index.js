'use strict';

const logger = require('../../../utils/logger');


module.exports.runIntent = function runIntent(intentName, davis, data) {
    logger.info(`Loading the '${intentName}' intent`);
    try {
        const intent = require(`./${intentName}`);
        return intent.process(davis, data);
    } catch (err) {
        logger.error(`There was an issue running ${intentName}.`);
        logger.error(`It failed with the following message: ${err.message}`);
        return new Error(err.message);
    }
};