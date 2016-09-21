'use strict';

const logger = require('../../../utils/logger');

const url = {
    /**
     * Builds a hyperlink to the top ranked event
     * @param {Object} user - The user object (davis.user)
     * @param {Object} problem - A problem object from Dynatrace
     * @returns {string} - URL
     */
    topImpactURL: (user, problem) => {
        let url = user.dynatrace.url;
        // Problem details have rankedEvents and problem summaries have rankedImpacts
        let event = (problem.rankedEvents) ? problem.rankedEvents[0] : problem.rankedImpacts[0];
        let entityId = event.entityId;

        if (entityId.startsWith('SYNTHETIC')) {
            url = `${url}/#webcheckdetailV3;webcheckId=${entityId};pid=${problem.id}`;
        } else if (entityId.startsWith('HOST')) {
            url = `${url}/#hosts/hostdetails;id=${entityId};pid=${problem.id}`;
        } else if (entityId.startsWith('APPLICATION')) {
            url = `${url}/#uemappmetrics;uemapplicationId=${entityId};pid=${problem.id}`;
        } else if (entityId.startsWith('SERVICE')) {
            url = `${url}/#services/servicedetails;id=${entityId};pid=${problem.id}`;
        } else if (entityId.startsWith('PROCESS')) {
            url = `${url}/#processdetails;id=${entityId};pid=${problem.id}`;
        } else if (entityId.startsWith('HYPERVISOR')) {
            url = `${url}/#hypervisordetails;id=${entityId};pid=${problem.id}`;
        } else {
            logger.warn(`Unable to build a top impact URL because ${entityId} doesn't match any defined values.`);
            url = `${url}/#problems;filter=watched/problemdetails;pid=${problem.id}`;
        }
        return url;
    }

};

module.exports = url;