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
    
    const startFormat = {
        normal: {
            sameDay: '[today] h:mm A',
            lastDay: '[yesterday] h:mm A',
            lastWeek: 'dddd [at] h:mm A'
        },
        between: {
            sameDay: '[today between] h:mm A',
            lastDay: '[yesterday between] h:mm A',
            lastWeek: '[between] dddd [at] h:mm A'
        }
    };
    
    const stopFormat = {
        normal: {
            sameDay: '[today] h:mm A',
            lastDay: '[yesterday] h:mm A',
            lastWeek: 'dddd [at] h:mm A'
        },
        sameday: {
            sameDay: 'h:mm A',
            lastDay: 'h:mm A',
            lastWeek: 'dddd [at] h:mm A'
        }
    };
    
    /**
     * @param {Object} entity
     * @param {string} displayName - undefined, 'audible' or 'visual'
     */
    env.addFilter('friendlyEntityName', function(entity, displayType) {
        //ToDo overhaul this logic
        displayType = displayType || 'audible';
        return getFriendlyEntityName(aliases, getEntityType(entity), entity.entityName, displayType);
    });
    
    env.addFilter('friendlyStatus', function(status) {
        return (status == 'OPEN') ? 'ongoing' : 'closed';
    });
    
    env.addFilter('time', function(time, user) {
        return moment.tz(time, user.timezone).calendar(null , {
            sameDay: '[today at] h:mm A',
            lastDay: '[yesterday at] h:mm A',
            lastWeek: 'dddd [at] h:mm A'
        });
    });

    env.addFilter('friendlyTime', function(time, user) {
        return moment.tz(time, user.timezone).floor(5, 'minutes').calendar(null , {
            sameDay: '[around] h:mm A',
            lastDay: '[yesterday around] h:mm A',
            lastWeek: 'dddd [around] h:mm A'
        });
    });
    
    env.addFilter('friendlyTimeRange', function(timeRange, user, isCompact) {
        let sentence = (isCompact) ? moment.tz(timeRange.startTime, user.timezone).calendar(null , startFormat.normal) : moment.tz(timeRange.startTime, user.timezone).calendar(null , startFormat.between);
        if (timeRange.stopTime > timeRange.startTime) {
            if (moment.duration(moment.tz(timeRange.stopTime, user.timezone).diff(moment.tz(timeRange.startTime, user.timezone), 'hours')) < 24 && isCompact) {
                sentence += (isCompact) ? ' - ' : ' and ';
                sentence += moment.tz(timeRange.stopTime, user.timezone).calendar(null , stopFormat.sameday);
            } else {
                sentence += (isCompact) ? ' - \\n' : ' and ';
                sentence += moment.tz(timeRange.stopTime, user.timezone).calendar(null , stopFormat.normal);
            }
        }
        
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
    
    env.addFilter('capitalizeFirstChar', function(str) {
        return capitalizeFirstCharacter(str); 
    });
    
    env.addFilter('friendlyVersion', function(version) {
        return version.replace('v', '');
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
        return _.get(alias, `display.${displayType}`, alias.name);
    } else {
        logger.warn(`Unable to find a user defined ${type} alias for '${name}'!  Please consider adding one.`);
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
        title += capitalizeFirstCharacter(word);
    });
    return title;
}

function capitalizeFirstCharacter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1) + ' ';
}

module.exports = filters;