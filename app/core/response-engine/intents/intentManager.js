'use strict';

const logger = require('../../../utils/logger'),
    _ = require('lodash');

const intentName = ['problem'],
    intents = {};

const intentManager  = {
    init: () => {
        _(intentName).forEach((name) => {
            logger.debug(`Attempting to register ${name}.`);
            require(`./${name}`);
        });
    },

    registerIntent: (intent) => {
        if (intents[intent.name]) {
            throw new Error(`The ${intent.name} intent is already registered!`);
        }
        intents[intent.name] = intent;
    },

    getIntent: (intentName) => {
        logger.info(`Loading the ${intentName} intent`);
        return intents[intentName];
    },

    getResponse: (intentName, davis) => {
        if(intents[intentName]) {
            return intents[intentName].getResponse(davis);
        } else {
            let msg = `${intentName} doesn't exist!`;
            logger.error(msg);
            return new Error(msg);
        }
    }
};

module.exports = intentManager;