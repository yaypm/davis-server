'use strict';

const _ = require('lodash'),
    url = require('../../utils/url'),
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
        logger.debug('Offering to open the link for the user.');
        davis.exchange.state = {
            type: 'problemDetails',
            url:  url.topImpactURL(davis.user, davis.intentData.problemDetails.result),
            next: {
                send: null,
                yes: 'send',
                no: null
            }
        };
        davis.exchange.response.finished = false;
        return _.sample(['Would you like me to open this for you?']);
    },

    notification: () => {
        logger.debug('This is a push notification so we don\'t need a follow up');
    }
};

module.exports = state;