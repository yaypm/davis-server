'use strict';

const moment = require('moment-timezone'),
    _ = require('lodash'),
    S = require('string'),
    nlp = require('nlp_compromise'),
    logger = require('../../../../utils/logger'),
    events = require('../../../../config/internal-aliases');

require('moment-round');

/************************************************************
 *                   Nunjucks Filter Section
 * 
 *   https://mozilla.github.io/nunjucks/api.html#custom-filters
 * 
 ***********************************************************/
const filters = function(env, aliases) {
    /**
     * @param {Object} entity
     * @param {string} displayName - undefined, 'audible' or 'visual'
     */
    env.addFilter('friendlyEntityName', function(entity, displayType) {
        return getFriendlyEntityName(aliases, getEntityType(entity), entity.entityName, displayType);
    });
    
    env.addFilter('friendlyStatus', function(status) {
        return (status == 'OPEN') ? 'ongoing' : 'closed';
    });
    
    env.addFilter('time', function(time, user) {
        return moment.tz(time, user.timezone).calendar(null , {
            sameDay: '[Today at] h:mm a',
            lastDay: '[Yesterday at] h:mm a',
            lastWeek: 'dddd [at] h:mm a'
        });
    });

    env.addFilter('friendlyTime', function(time, user) {
        return moment.tz(time, user.timezone).floor(5, 'minutes').calendar(null , {
            sameDay: '[around] h:mm a',
            lastDay: '[yesterday around] h:mm a',
            lastWeek: 'dddd [around] h:mm a'
        });
    });

    env.addFilter('friendlyTimeRange', function(timeRange, user) {
        let sentence = moment.tz(timeRange.startTime, user.timezone).calendar(null , {
            sameDay: '[today between] h:mm a',
            lastDay: '[yesterday between] h:mm a',
            lastWeek: '[between] dddd [at] h:mm a'
        });
        sentence += ' and ';
        sentence += moment.tz(timeRange.stopTime, user.timezone).calendar(null , {
            sameDay: 'h:mm a',
            lastDay: 'h:mm a',
            lastWeek: 'dddd [at] h:mm a'
        });
        return sentence;
    });

    env.addFilter('friendlyEvent', function(eventName) {
        let event = _.find(events.events, e => e.name === eventName);

        if (_.isNil(event)) {
            logger.warn(`Unable to find a friendly event for '${eventName}'!  Please consider adding one.`);
            return S(eventName).humanize().s.toLowerCase();
        } else {
            return _.sample(event.friendly);
        }
    });
    
    env.addFilter('friendlyEventFirstAlias', function(eventName) {
        let event = _.find(events.events, e => e.name === eventName);

        if (_.isNil(event)) {
            logger.warn(`Unable to find a friendly event for '${eventName}'!  Please consider adding one.`);
            return S(eventName).humanize().s.toLowerCase();
        } else {
            return event.friendly[0];
        }
    });
    
    env.addFilter('pluralizeNoun', function(str, count) {
        return count === 1 ? str : nlp.noun(str).pluralize();
    });
    
    env.addFilter('makeTitle', function(str) {
        return makeTitle(str); 
    });
};

function getEntityType(entity) {
    if (entity.impactLevel === 'APPLICATION') {
        return 'applications';
    } else if (entity.impactLevel === 'SERVICE') {
        return 'services';
    } else if (entity.impactLevel === 'INFRASTRUCTURE') {
        return 'infrastructure';
    } else {
        logger.warn(`Unknown impact level: ${entity.impactLevel}`);
    }
}

function getFriendlyEntityName(aliases, type, name, displayType) {
    // Strips off any port numbers if they exist
    let modifiedName = name.toLowerCase().split(':')[0];

    let alias = _.find(aliases[type], function(o) {
        // ToDo Add a case insensitive include
        return o.name.toLowerCase() === name.toLowerCase() ||
            o.name.toLowerCase() === modifiedName || 
            _.includes(o.aliases, name);
    }) || null;

    if (!_.isNull(alias)) {
        logger.debug(`Found a user defined ${type} alias for ${name}.`);
        // Returning the alias display type if defined otherwise returning the name
        if (_.isNil(displayType)) {
            return alias.name;
        } else {
            return _.get(alias, `display.${displayType}`, alias.name);
        }
    } else {
        logger.warn(`Unable to find a user defined alias for '${name}'!  Please consider adding one.`);
        return S(name).humanize().s.toLowerCase();
    }
}

function makeTitle(title) {
    // Strip off any leading "a "
    let titleArray = title.split(' ');
    if (titleArray[0] == 'a') {
        titleArray[0] = '';
    }
    title = '';
    titleArray.forEach( (word) => {
        title += word.charAt(0).toUpperCase() + word.slice(1) + ' ';
    });
    return title;
}

module.exports = filters;