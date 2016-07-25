'use strict';

const   moment = require('moment'),
    _ = require('lodash'),
    S = require('string'),
    logger = require('../../../utils/logger'),
    aliases = require('../../../config/aliases');

/************************************************************
 *                   Nunjucks Filter Section
 * 
 *   https://mozilla.github.io/nunjucks/api.html#custom-filters
 * 
 ***********************************************************/
const filters = function(env, aliases) {
    env.addFilter('sayFriendlyServiceName', function(serviceName) {
        return getFriendlyEntityName(aliases, 'services', serviceName, 'say');
    });

    env.addFilter('showFriendlyServiceName', function(serviceName) {
        return getFriendlyEntityName(aliases, 'services', serviceName, 'show');
    });

    env.addFilter('timeOfDayGreeting', function(datetime) {
        let hour = moment(datetime).format('H');
        if (hour < 6 ) {
            return 'night';
        } else if ( hour < 11 ) {
            return 'morning';
        } else if ( hour < 15 ) {
            return 'afternoon';
        } else if ( hour < 21 ) {
            return 'evening';
        }else {
            return 'night';
        }
    });
};

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
        logger.warn(`Unable to find a user defined alias for '${name}'!  Please consider adding one.`);
        return S(name).humanize().s.toLowerCase();
    }
}

module.exports = filters;