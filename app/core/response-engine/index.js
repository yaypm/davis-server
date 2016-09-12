'use strict';
const intents = require('./intents');

module.exports = {
    generate: davis => {
        return intents.runIntent(davis.exchange.request.analysed.intent, davis, davis.data);
    }
};