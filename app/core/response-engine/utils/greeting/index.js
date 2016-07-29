'use strict';

const BbPromise = require('bluebird'),
    _ = require('lodash'),
    DecisionTree = require('decision-tree'),
    moment = require('moment-timezone'),
    common = require('../common'),
    templateGenerator = require('../template'),
    path = require('path'),
    logger = require('../../../../utils/logger');

const GREETING_WEEK_THRESHOLD = 1,
    GREETING_DAY_THRESHOLD = 2,
    GREETING_HOUR_THRESHOLD = 2;

const tags = {};

module.exports = {
    greet: davis => {
        logger.debug('Generating the user greeting');

        return new BbPromise((resolve, reject) => {
            davis.conversation.lastInteraction()
                .then(result => {
                    let lastInteractionTime = _.get(result, '[1].updatedAt'),
                        currentInteractionTime = davis.createdAt;

                    tags.lang = common.getLanguage(davis.user);
                    tags.newUser = isNewUser(davis.user);
                    tags.lastInteraction = lastInteraction(currentInteractionTime, lastInteractionTime, davis.user.timezone);
                    tags.timeOfDay = timeOfDay(currentInteractionTime, davis.user.timezone);

                    logger.debug(`Dumping the greetings tag: ${JSON.stringify(tags)}`);
                    let template = decide('template', training_model, tags);
                    //ToDo review this logic
                    if(_.isNil(template)) return resolve('');

                    logger.debug(`Using the ${template} for greeting.`);

                    let templatePath = path.join(__dirname, 'templates', template);
                    return templateGenerator.getTemplate(templatePath)
                        .then(templateName => {
                            return templateGenerator.render(path.join('utils', 'greeting', 'templates', template, templateName), davis)
                        })
                        .then(response => {
                            logger.debug(`The generated greeting is '${response}'`);
                            return resolve(response);
                        });
                })
                .catch(err => {
                    logger.error('Ran into an issue creating the greeting.');
                    return reject(err);
                });
        });
    }
};

function isNewUser(lastInteractionTime) {
    return _.isNil(lastInteractionTime);
}

function lastInteraction(currentInteractionTime, lastInteractionTime, timezone) {
    if(_.isNil(lastInteractionTime)) {
        return null;
    } else {
        const current = moment.tz(currentInteractionTime, timezone),
            last = moment.tz(lastInteractionTime, timezone),
            difference = moment.duration(current.diff(last));

        //ToDo Fix this logic
        if(difference.asHours() < GREETING_HOUR_THRESHOLD) {
            logger.debug('We just talked... no reason to greet.');
            return 'recent';
        } else if (current.isoWeekday() === 1 && last.isoWeekday() === 5) {
            logger.debug('Today is Monday and we haven\'t spoken since Friday.  Lets assume the user just got back from weekend and NOT that they didn\'t want to talk to us');
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

/**
 * decision tree model
 */
const training_model = [
	{'lang': 'en-us', 'newUser': false, 'lastInteraction': 'recent',    'timeOfDay': null,        'template': null},
    {'lang': 'en-us', 'newUser': false, 'lastInteraction': 'weekend',   'timeOfDay': null,        'template': 'en-us/lastInteraction/weekend'},
    {'lang': 'en-us', 'newUser': false, 'lastInteraction': 'yesterday', 'timeOfDay': null,        'template': 'en-us/lastInteraction/yesterday'},
    {'lang': 'en-us', 'newUser': false, 'lastInteraction': 'hours',     'timeOfDay': 'afternoon', 'template': 'en-us/lastInteraction/hours/afternoon'},
    {'lang': 'en-us', 'newUser': false, 'lastInteraction': 'hours',     'timeOfDay': 'evening',   'template': 'en-us/lastInteraction/hours/evening'},
    {'lang': 'en-us', 'newUser': false, 'lastInteraction': 'hours',     'timeOfDay': 'morning',   'template': 'en-us/lastInteraction/hours/morning'},
    {'lang': 'en-us', 'newUser': false, 'lastInteraction': 'days',      'timeOfDay': null,        'template': 'en-us/lastInteraction/days'},
    {'lang': 'en-us', 'newUser': false, 'lastInteraction': 'weeks',     'timeOfDay': null,        'template': 'en-us/lastInteraction/weeks'},
    {'lang': 'en-us', 'newUser': false, 'lastInteraction': 'default',   'timeOfDay': null,        'template': null},
    {'lang': 'en-us', 'newUser': true,  'lastInteraction': null,        'timeOfDay': null,        'template': 'en-us/newUser'}
];

function decide(className, model, tags) {

    const dt = new DecisionTree(training_model, className, ['lang', 'newUser', 'lastInteraction', 'timeOfDay']);
    return dt.predict(tags);
}