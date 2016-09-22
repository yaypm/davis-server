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
        //ToDo overhaul this logic
        displayType = displayType || 'audible';
        return getFriendlyEntityName(aliases, getEntityType(entity), entity.entityName, displayType);
    });

    /**
     * @param {Object} name
     * @param {string} displayName - undefined, 'audible' or 'visual'
     */
    env.addFilter('friendlyApplicationName', function(name, displayType) {
        displayType = displayType || 'audible';
        return getFriendlyEntityName(aliases, 'applications', name, displayType);
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
        return getFriendlyTimeRange(timeRange, user, isCompact);
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

// Date formatting
const startFormat = {
    normal: {
        sameDay: '[today] h:mm A',
        lastDay: '[yesterday] h:mm A',
        lastWeek: 'dddd [at] h:mm A',
        sameElse: 'MM/DD/YYYY [at] h:mm A'
    },
    between: {
        sameDay: '[today between] h:mm A',
        lastDay: '[yesterday between] h:mm A',
        lastWeek: '[between] dddd [at] h:mm A',
        sameElse: '[between] MM/DD/YYYY [at] h:mm A'
    }
};

const stopFormat = {
    normal: {
        sameDay: '[today] h:mm A',
        lastDay: '[yesterday] h:mm A',
        lastWeek: 'dddd [at] h:mm A',
        sameElse: 'MM/DD/YYYY [at] h:mm A'
    },
    sameday: {
        sameDay: 'h:mm A',
        lastDay: 'h:mm A',
        lastWeek: 'dddd [at] h:mm A',
        sameElse: 'MM/DD/YYYY [at] h:mm A'
    }
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
    const modifiedName = name.split(':')[0];

    const alias = _.find(aliases[type], function(o) {
        return o.name.toLowerCase() === name.toLowerCase() ||
            o.name.toLowerCase() === modifiedName.toLowerCase() ||
            _.some(o.aliases, i => i.toLowerCase() === name.toLowerCase());
    }) || null;

    if (!_.isNull(alias)) {
        logger.debug(`Found a user defined ${type} alias for ${name}.`);
        // Returning the alias display type if defined otherwise returning the name
        return _.get(alias, `display.${displayType}`, alias.name);
    } else {
        logger.warn(`Unable to find a user defined ${type} alias for '${modifiedName}'!  Please consider adding one.`);
        return S(modifiedName).humanize().s.toLowerCase();
    }
}

function getFriendlyTimeRange(timeRange, user, isCompact) {
    let sentence = (isCompact) ? capitalizeFirstCharacter(moment.tz(timeRange.startTime, user.timezone).calendar(null , startFormat.normal)).trim() : moment.tz(timeRange.startTime, user.timezone).calendar(null , startFormat.between).trim();
    if (timeRange.stopTime > timeRange.startTime) {
        if (moment.duration(moment.tz(timeRange.stopTime, user.timezone).diff(moment.tz(timeRange.startTime, user.timezone), 'hours')) < 24) {
            sentence += (isCompact) ? ' - ' : ' and ';
            sentence += (isCompact) ? capitalizeFirstCharacter(moment.tz(timeRange.stopTime, user.timezone).calendar(null , stopFormat.sameday)).trim() : moment.tz(timeRange.stopTime, user.timezone).calendar(null , stopFormat.sameday).trim();
        } else {
            sentence += (isCompact) ? ' - \\n' : ' and ';
            sentence += (isCompact) ? capitalizeFirstCharacter(moment.tz(timeRange.stopTime, user.timezone).calendar(null , stopFormat.normal)).trim() : moment.tz(timeRange.stopTime, user.timezone).calendar(null , stopFormat.normal).trim();
        }
    }
    return sentence;
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