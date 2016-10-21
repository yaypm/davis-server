'use strict';

const _ = require('lodash'),
    logger = require('../../../utils/logger');


module.exports.runIntent = function runIntent(intentName, davis, data) {
    logger.info(`Loading the '${intentName}' intent`);
    try {
        const intent = require(`./${intentName}`);

        // Just making sure the intent array is up to date
        if (_.head(davis.exchange.intent) !== intentName) {
            davis.exchange.intent.push(intentName);
        }
        return intent.process(davis, data);
    } catch (err) {
        logger.error(`There was an issue running ${intentName}.`);
        logger.error(`It failed with the following message: ${err.message}`);
        
        if (err.code === 'MODULE_NOT_FOUND') {
            const missingIntent = require(`./missingIntent`);
            return missingIntent.process(davis, intentName);
        } else {
            return new Error(err.message);
        }
    }
};