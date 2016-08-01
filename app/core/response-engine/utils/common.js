'use strict';

const _ = require('lodash');

module.exports = {
    getLanguage: function(user) {
        return user.lang || 'en-us';
    },

    saveIntentData: function(davis, property, data) {
        _.set(davis, `intentData.${property}`, data);
    },

    addTextResponse: function(exchange, response) {
        exchange.response.visual.text = response;
    }
};