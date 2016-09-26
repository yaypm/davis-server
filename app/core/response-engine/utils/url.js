'use strict';

const logger = require('../../../utils/logger');

const locations = {
        SYNTHETIC: '#monitors/webcheckdetail;webcheckId',
        HOST: '#hosts/hostdetails;id',
        APPLICATION: '#uemappmetrics;uemapplicationId',
        SERVICE: '#services/servicedetails;id',
        PROCESS: '#processdetails;id',
        HYPERVISOR: '#hypervisordetails;id'
};

const url = {
    /**
     * Builds a hyperlink to the top ranked event
     * @param {Object} user - The user object (davis.user)
     * @param {Object} problem - A problem object from Dynatrace
     * @returns {string} - URL
     */
    topImpactURL: (user, problem) => {
        // Problem details have rankedEvents and problem summaries have rankedImpacts
        let event = (problem.rankedEvents) ? problem.rankedEvents[0] : problem.rankedImpacts[0];
        return (locations[event.entityId.split('_')[0]]) ? `${user.dynatrace.url}/${locations[event.entityId.split('_')[0]]}=${event.entityId};pid=${problem.id}` 
                                           : `${user.dynatrace.url}/#problems;filter=watched/problemdetails;pid=${problem.id}`;
    },
    
    problems: (user) => {
        return `${user.dynatrace.url}/#problems`;
    },
    
    problem: (problem, user) => {
        return `${user.dynatrace.url}/#problems;filter=watched/problemdetails;pid=${problem.id}`;
    },
    
    event: (event, user) => {
        return (locations[event.entityId.split('_')[0]]) ? `${user.dynatrace.url}/${locations[event.entityId.split('_')[0]]}=${event.entityId}` 
                                           : `${user.dynatrace.url}/#problems`;
    }

};

module.exports = url;