'use strict';

const moment = require('moment-timezone'),
    _ = require('lodash'),
    S = require('string'),
    nlp = require('nlp_compromise'),
    urlUtil = require('../../utils/url'),
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
     * Entity's alias if one exists under demo/aliases/
     * @param {Object} entity
     * @param {String} displayName - undefined, 'audible' or 'visual'
     * @return {String} getFriendlyEntityName()
     */
    env.addFilter('friendlyEntityName', function(entity, displayType) {
        //ToDo overhaul this logic
        displayType = displayType || 'audible';
        return getFriendlyEntityName(aliases, getEntityType(entity), entity.entityName, displayType);
    });

    /**
     * Entity's alias if one exists under demo/aliases/applications.js 
     * @param {Object} name
     * @param {String} displayName - undefined, 'audible' or 'visual'
     * @return {String} 
     */
    env.addFilter('friendlyApplicationName', function(name, displayType) {
        displayType = displayType || 'audible';
        return getFriendlyEntityName(aliases, 'applications', name, displayType);
    });
    
    /**
     * Friendly problem status  
     * @param {String} status - OPEN or CLOSED
     */
    env.addFilter('friendlyStatus', function(status) {
        return (status == 'OPEN') ? 'ongoing' : 'closed';
    });
    
    /**
     * Formatted version of a date, taking into account the user's timezone 
     * @param {String} time
     * @param {Object} user
     * @return {String} moment.tz().cal() - Moment JS timezone and calendar format
     */
    env.addFilter('time', function(time, user) {
        return moment.tz(time, user.timezone).calendar(null , {
            sameDay: '[today at] h:mm A',
            lastDay: '[yesterday at] h:mm A',
            lastWeek: 'dddd [at] h:mm A'
        });
    });

    /**
     * Formatted version of a date with time rounded down to nearest multiple of 5, 
     * taking into account the user's timezone
     * @param {String} time
     * @param {Object} user
     * @return {String} moment.tz().floor().cal() - Moment JS timezone, floor, and calendar format
     */
    env.addFilter('friendlyTime', function(time, user) {
        return moment.tz(time, user.timezone).floor(5, 'minutes').calendar(null , {
            sameDay: '[around] h:mm A',
            lastDay: '[yesterday around] h:mm A',
            lastWeek: 'dddd [around] h:mm A'
        });
    });
    
    /**
     * Formatted version of a time range (object with start and stop dates), 
     * taking into account the user's timezone,
     * along with the option to output a compact version for use in cards
     * @param {String} time
     * @param {Object} user
     * @param {Boolean} isCompact
     * @return {String} moment.tz().cal() - Moment JS timezone
     */
    env.addFilter('friendlyTimeRange', function(timeRange, user, isCompact) {
        return getFriendlyTimeRange(timeRange, user, isCompact);
    });

    /**
     * Event's alias if one exists under config/internal-aliases/events.js 
     * @param {String} eventName
     * @return {String} event.friendly (if multiple, randomly selected) or eventName (if no alias exists)
     */
    env.addFilter('friendlyEvent', function(eventName) {
        let event = _.find(events.events, e => e.name === eventName);

        if (_.isNil(event)) {
            logger.warn(`Unable to find a friendly event for '${eventName}'!  Please consider adding one.`);
            return S(eventName).humanize().s.toLowerCase();
        } else {
            return _.sample(event.friendly);
        }
    });
    
    /**
    * Event's alias if one exists under config/internal-aliases/events.js 
    * @param {String} eventName
    * @return {String} event.friendly[0] (if multiple, select first one) or eventName (if no alias exists)
    */
    env.addFilter('friendlyEventFirstAlias', function(eventName) {
        let event = _.find(events.events, e => e.name === eventName);

        if (_.isNil(event)) {
            logger.warn(`Unable to find a friendly event for '${eventName}'!  Please consider adding one.`);
            return S(eventName).humanize().s.toLowerCase();
        } else {
            return event.friendly[0];
        }
    });
    
    /**
    * Plural version of string
    * @param {String} str - item (single word)
    * @param {Integer} count - amount of item
    * @return {String} pluralizeNoun()
    */
    env.addFilter('pluralizeNoun', function(str, count) {
        return pluralizeNoun(str, count);
    });
    
    /**
    * Capitalize the first letter of each word in string
    * @param {String} str
    * @return {String} makeTitle()
    */
    env.addFilter('makeTitle', function(str) {
        return makeTitle(str); 
    });
    
    /**
    * Capitalize the first letter of string
    * @param {String} str - single word
    * @return {String} capitalizeFirstCharacter()
    */
    env.addFilter('capitalizeFirstChar', function(str) {
        return capitalizeFirstCharacter(str); 
    });
    
    /**
     * Build the url for viewing a problem in the platform 
     * @param {Object} problem
     * @param {Object} user
     * @return {String} urlUtil.problem()
     */
    env.addFilter('buildProblemUrl', function(problem, user) {
        return buildProblemUrl(problem, user);
    });
    
    /**
     * Build the url for viewing a tenant's problems in the platform 
     * @param {Object} problems - not used, passed in to keep url filter parameters consistant
     * @param {Object} user
     * @return {String} urlUtil.problem()
     */
    env.addFilter('buildProblemsUrl', function(problems, user) {
        return buildProblemsUrl(problems, user);
    });
    
    /**
     * Build the url for viewing an event in the platform 
     * @param {Object} event
     * @param {Object} user
     * @return {String} urlUtil.event()
     */
    env.addFilter('buildEventUrl', function(event, user) {
        return buildEventUrl(event, user);
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
    return sentence
}

function makeTitle(title) {
    
    // Strip off any leading "a "
    let titleArray = title.split(' ');
    if (titleArray[0] == 'a') {
        titleArray[0] = '';
    }
    title = '';
    titleArray.forEach( (word) => {
        title += capitalizeFirstCharacter(word) + ' ';
    });
    return title.trim();
}

function capitalizeFirstCharacter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function pluralizeNoun(str, count) {
    return count === 1 ? str : nlp.noun(str).pluralize();
}

function buildProblemUrl(problem, user) {
    return urlUtil.problem(problem, user);
}

function buildProblemsUrl(problems, user) {
    return urlUtil.problems(user);
}

function buildEventUrl(event, user) {
    return urlUtil.event(event, user);
}

module.exports = filters;