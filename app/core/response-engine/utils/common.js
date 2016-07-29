'use strict';

module.exports = {
    getLanguage: function(user) {
        return user.lang || 'en-us';
    },

    addTextResponse: function(exchange, response) {
        exchange.response.visual.text = response;
    }
};