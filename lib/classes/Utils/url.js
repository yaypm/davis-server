'use strict';

const _ = require('lodash');

const locations = {
  SYNTHETIC: '#monitors/webcheckdetail;webcheckId',
  HOST: '#hostdetails;id',
  APPLICATION: '#uemappmetrics;uemapplicationId',
  MOBILE_APPLICATION: '#mobileappoverview;appId',
  SERVICE: '#services/servicedetails;id',
  PROCESS: '#processdetails;id',
  HYPERVISOR: '#hypervisordetails;id',
};

const urlBuilder = {
  /**
   * Builds a hyperlink to the top ranked event
   * @param {Object} user - The user object (davis.user)
   * @param {Object} problem - A problem object from Dynatrace
   * @returns {string} - URL
   */
  topImpactURL: (problem, baseUrl) => {
    // Problem details have rankedEvents and problem summaries have rankedImpacts
    const event = (problem.rankedEvents) ? problem.rankedEvents[0] : problem.rankedImpacts[0];
    let url = `${baseUrl}/#problems;filter=watched/problemdetails;pid=${problem.id}`;

    _.forEach(locations, (location) => {
      if (event.entityId.includes(location)) {
        url = `${baseUrl}/${locations[location]}=${event.entityId};pid=${problem.id}`;
        return;
      }
    });

    return url;
  },

  problems: (problems, baseUrl, timeRange) => {
    let timeFilter = ';gtf=l_2_HOURS';
    if (timeRange.startTime && timeRange.stopTime) {
      timeFilter = `;gtf=c_${timeRange.startTime}_${timeRange.stopTime}`;
    }
    return `${baseUrl}/#problems${timeFilter}`;
  },

  problem: (problem, baseUrl) => `${baseUrl}/#problems;filter=watched/problemdetails;pid=${problem.id}`,

  event: (problem, event, baseUrl) => {
    for (const location in locations) {
      if (event.entityId.includes(location)) {
        return `${baseUrl}/${locations[location]}=${event.entityId};gtf=p_${problem.id};pid=${problem.id}`;
      }
    }

    return `${baseUrl}/#problems`;
  },

};

module.exports = urlBuilder;
