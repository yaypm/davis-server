'use strict';

const _ = require('lodash'),
    common = require('../../utils/common'),
    time = require('../../utils/time'),
    logger = require('../../../../utils/logger');

const tagger = {
    tag: davis => {
        return {
            lang: common.getLanguage(davis.user),
            tense: getTense(davis.exchange),
            problems: getCount(davis.intentData)
        };
    }
};

const getTense = function(exchange) {
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
};

const getCount = function(intentData) {
    let problems = _.get(intentData, 'problem.result.problems', null);
    if(!_.isNull(problems)) {
        let numOfProblems = problems.length;
        if (numOfProblems === 0) {
            logger.debug('Zero problems detected');
            return 'zero';
        } else if (numOfProblems === 1) {
            logger.debug('One problem detected');
            return 'one';
        } else if (numOfProblems === 2) {
            logger.debug('Two problems detected');
            return 'two';
        } else {
            logger.debug('Multiple problems detected');
            return 'many';
        }
    } else {
        logger.warn('No problem data supplied!');
        return null;
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

module.exports = tagger;