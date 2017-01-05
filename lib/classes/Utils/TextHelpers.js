const S = require('string');
const _ = require('lodash');
const urlUtil = require('../Utils/url');

const events = require('../Dynatrace/events');

class Filters {
  constructor(davis) {
    this.davis = davis;
  }

  capitalize(str) {
    return S(str).capitalize().s;
  }

  buildProblemUrl(problem) {
    return urlUtil.problem(problem, this.davis.config.getDynatraceUrl());
  }

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
      S(eventName).humanize().toLowerCase.s :
      event.friendly[0];
  }

  toTitleCase(str) {
    return S(str).titleCase().s;
  }
}

module.exports = Filters;

