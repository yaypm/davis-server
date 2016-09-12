'use strict';

const _ = require('lodash'),
    logger = require('../../../../utils/logger');

const state = {
    default: (davis) => {
        logger.debug('We aren\'t able to push the URL anywhere');
        davis.exchange.state = {
            type: 'problemDetails',
            next: {
                yes: null,
                no: 'stop'
            }
        };
        davis.exchange.response.finished = false;
        return _.sample(['Is there anything else I can help with?', 'What else can I help you with?', 'What else would you like to know?']);
    },

    openLink: (davis) => {
        davis.exchange.state = {
            type: 'problemDetails',
            url:  `${davis.user.dynatrace.url}#problems;filter=watched/problemdetails;pid=${davis.intentData.problemDetails.result.id}`,
            next: {
                send: null,
                yes: 'send',
                no: null
            }
        };
        davis.exchange.response.finished = false;
        return _.sample(['Would you like for me to open this for you?']);
    },

    notification: () => {
        return;
    }
};

module.exports = state;