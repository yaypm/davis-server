'use strict';

const _ = require('lodash'),
    time = require('./time'),
    logger = require('../../../utils/logger');

module.exports = {
    /**
     * Gets the language
     * @param user ['en-us'] - The davis user object
     * @returns {string}
     */
    getLanguage: function(user) {
        return user.lang || 'en-us';
    },

    getTense: function(exchange) {
        let timeRange = _.get(exchange, 'request.analysed.timeRange', null);
        if(isPresentTense(timeRange)) {
            logger.debug('Problem is present tense');
            return 'present';
        } else if (isPastTense(timeRange.startTime, exchange.startTime)) {
            logger.debug('Problem is past tense');
            return 'past';
        } else if (isFutureTense(timeRange.startTime, exchange.startTime)) {
            logger.warn('The user is asking about a future problem.  Either they think we\'re psychic or we misunderstood the question.');
            logger.warn(`They said '${exchange.request.text}' and we thought the requested start time was ${timeRange.startTime}`);
            logger.warn(`which is after the current time ${exchange.startTime}`);
            return 'future';
        } else {
            logger.debug('Unable to figure out a tense');
            return null;
        }
    },

    saveIntentData: function(davis, property, data) {
        _.set(davis, `intentData.${property}`, data);
    },

    addTextResponse: function(exchange, response) {
        exchange.response.visual.text = response;
    }
};

const isPresentTense = function(timeRange) {
    return _.isNil(timeRange);
};

const isPastTense = function(startTime, endTime) {
    return time.isBefore(startTime, endTime);
};

const isFutureTense = function(startTime, endTime) {
    return !time.isBefore(startTime, endTime);
};