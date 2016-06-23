'use strict';

const logger = require('../../../utils/logger');

let intents = {};

const intentManager  = {

    registerIntent: (intent) => {
        if (intents[intent.name]) {
            throw new Error(`The ${intent.name} intent is already registered!`);
        }
        intents[intent.name] = intent;
    },

    getIntent: (intentName) => {
        logger.info(`Loading the ${intentName} intent`);
        return intents[intentName];
    }
};

module.exports = intentManager;

// Dynamically load in all intents
require('require-all')({dirname: __dirname, filter: /.+\.js$/, recursive: true});