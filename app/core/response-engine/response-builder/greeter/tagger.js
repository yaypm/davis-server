'use strict';

const _ = require('lodash'),
    moment = require('moment-timezone'),
    common = require('../../utils/common'),
    logger = require('../../../../utils/logger');

const GREETING_WEEK_THRESHOLD = 1,
    GREETING_DAY_THRESHOLD = 1,
    GREETING_HOUR_THRESHOLD = 1;

const tagger = {
    tag: (davis, interactionHistory) => {
        let lastInteractionTime = _.get(interactionHistory, '[1].updatedAt'),
            currentInteractionTime = davis.createdAt;

        return {
            lang: common.getLanguage(davis.user),
            internal: isInternalUser(davis.user),
            lastInteraction: lastInteraction(currentInteractionTime, lastInteractionTime, davis.user.timezone),
            timeOfDay: timeOfDay(currentInteractionTime, davis.user.timezone)
        };
    }
};

function isInternalUser(user) {
    return user.id === 'davis-system';
}

function lastInteraction(currentInteractionTime, lastInteractionTime, timezone) {
    if(_.isNil(lastInteractionTime)) {
        return null;
    } else {
        const current = moment.tz(currentInteractionTime, timezone),
            last = moment.tz(lastInteractionTime, timezone),
            difference = moment.duration(current.diff(last));

        if(difference.asHours() < GREETING_HOUR_THRESHOLD) {
            logger.debug('We just talked... no reason to greet.');
            return 'recent';
        } else if (current.isoWeekday() === 1 && last.isoWeekday() === 5) {
            logger.debug('Today is Monday and we haven\'t spoken since Friday.  Lets assume the user just got back from weekend and NOT that they didn\'t want to talk to us!');
            return 'weekend';
        } else if (current.isoWeekday() === (last.isoWeekday() + 1)) {
            logger.debug('We last spoke yesterday');
            return 'yesterday';
        } else if (difference.asWeeks() >= GREETING_WEEK_THRESHOLD) {
            logger.debug('We have spoken in the last few weeks');
            return 'weeks';
        } else if (difference.asDays() >= GREETING_DAY_THRESHOLD) {
            logger.debug('We have spoken in the last few days');
            return 'days';
        } else if (difference.asHours() >= GREETING_HOUR_THRESHOLD) {
            logger.debug(`We spoke today but after our ${GREETING_HOUR_THRESHOLD} hour threshold.`);
            return 'hours';
        } else {
            logger.warn(`Unable to find a last interaction time for some reason.  The current time is ${current} and the last interaction was ${last}`);
            return 'default';
        }
    }
}

function timeOfDay(currentInteractionTime, timezone) {
    let response = null;

    const hourOfDay = moment.tz(currentInteractionTime, timezone).hour(),
        afternoon = 12,
        evening = 17;

    if (hourOfDay >= afternoon && hourOfDay <= evening) {
        response = 'afternoon';
    } else if (hourOfDay >= evening) {
        response = 'evening';
    } else {
        response = 'morning';
    }

    return response;
}

module.exports = tagger;