'use strict';

const _ = require('lodash');
const events = require('./events');

const STATUS_PRIORITY = ['OPEN', 'CLOSED'];
const IMPACT_PRIORITY = ['APPLICATION', 'SERVICE', 'INFRASTRUCTURE'];


class Problems {
  constructor(davis, problems, sort) {
    this.logger = davis.logger;
    this.davis = davis;
    let plist = problems || [];

    this.length = 0;
    this.push = Array.prototype.push;

    if (_.isNil(sort) || sort) {
      // _.sortBy sorts stably, which means we can use it as a multi-level sort
      plist = _.sortBy(plist, e => e.startTime);
      plist = _.sortBy(plist, e => !e.hasRootCause);
      plist = _.sortBy(plist, e => _.findIndex(events, { name: this.findMostImportantImpact(e) }));
      plist = _.sortBy(plist, e => IMPACT_PRIORITY.indexOf(e.impactLevel));
      plist = _.sortBy(plist, e => STATUS_PRIORITY.indexOf(e.status)); // top priority sort last
    }

    this._setProblems(plist);
  }

  filter(f) {
    const problems = [];
    for (let i = 0; i < this.length; i++) {
      problems.push(this[i]);
    }
    const newProblems = _.filter(problems, f);
    return new Problems(this.davis, newProblems, false);
  }

  _setProblems(problems) {
    _.forEach(problems, p => this.push(p));
  }

  findMostImportantImpact(problem) {
    let highestRankedImpact = null;
    let highestRankedImpactName = null;

    _.forEach(problem.rankedImpacts, (impact) => {
      const category = _.chain(events)
              .find((e) => e.name === impact.eventType)
              .get('type')
              .value();

      if (category === 'availability') {
        highestRankedImpact = 'availability';
        highestRankedImpactName = impact.eventType;
              // exits the for each loop early
        return;
      } else if (category === 'errors' && highestRankedImpact !== 'errors') {
        highestRankedImpact = 'errors';
        highestRankedImpactName = impact.eventType;
      } else if (category === 'performance' && highestRankedImpact !== 'performance') {
        highestRankedImpact = 'performance';
        highestRankedImpactName = impact.eventType;
      } else if (category === 'resources' && highestRankedImpact !== 'resources') {
        highestRankedImpact = 'resources';
        highestRankedImpactName = impact.eventType;
      } else if (_.isNull(highestRankedImpact)) {
        this.logger.debug(`Uncategorized impact '${impact.eventType}'`);
      }
    });
    return highestRankedImpactName;
  }
}

module.exports = Problems;
