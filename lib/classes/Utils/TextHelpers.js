'use strict';

const S = require('string');
const _ = require('lodash');
const urlUtil = require('../Utils/url');

const events = require('../Dynatrace/events');

const ACRONYMS = [
  'CPU',
  'ELB',
  'DB',
  'RDS',
  'PGI',
  'HTTP',
  'JS',
  'GC',
  'RMQ',
  'OSI',
  'EBS',
  'VM',
  'ESXI',
];

class TextHelpers {
  constructor(davis) {
    this.davis = davis;
  }

  capitalize(str) {
    return S(str).capitalize().s;
  }

  /**
   * Build the url for viewing a problem in the platform
   * @param {Object} problem
   * @return {String} urlUtil.problem()
   */
  buildProblemUrl(problem) {
    return urlUtil.problem(problem, this.davis.config.getDynatraceUrl());
  }

  /**
   * Build the url for viewing problems in the platform
   * @param {Object} problems
   * @param {Object} timeRange
   * @return {Array} urlUtil.problems()
   */
  buildProblemsUrl(problems, timeRange) {
    return urlUtil.problems(problems, this.davis.config.getDynatraceUrl(), timeRange);
  }

  /**
   * Build the url for viewing an event in the platform
   * @param {Object} problem
   * @param {Object} event
   * @return {String} urlUtil.event()
   */
  buildEventUrl(problem, event) {
    return urlUtil.event(problem, event, this.davis.config.getDynatraceUrl());
  }

  eventTitle(event) {
    return this.toTitleCase(this.friendlyEventFirstAlias(event.eventType)).replace('A ', '');
  }

  friendlyEntityName(entity) {
    return S(entity.entityName.split(':')[0])
      .humanize().s.toLowerCase();
  }

  friendlyEventFirstAlias(eventName) {
    const event = _.find(events, e => e.name === eventName);
    return (_.isNil(event)) ?
      S(eventName).humanize().toLowerCase().s :
      event.friendly[0];
  }

  problemTitle(problem) {
    return this.toTitleCase(`${problem.status} ${problem.impactLevel} level event`);
  }

  toTitleCase(str) {
    return this.capitalizeAcronyms(S(str).toLowerCase().titleCase().s);
  }

  capitalizeAcronyms(str) {
    let out = str;
    for (const acronym of ACRONYMS) {
      out = out.replace(new RegExp(`\\b${acronym}\\b`, 'i'), acronym.toUpperCase());
    }
    return out;
  }
}

module.exports = TextHelpers;

