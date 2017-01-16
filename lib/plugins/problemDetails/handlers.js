const _ = require('lodash');
const S = require('string');
const VB = require('../../classes/Utils/VisualBuilder');

function openField(events) {
  const openEvents = _.filter(events, e => e.status === 'OPEN').length;
  const total = events.length;

  return {
    title: 'Open',
    value: `${openEvents}/${total}`,
    short: true,
  };
}

function color(events) {
  const openEvents = _.filter(events, e => e.status === 'OPEN');
  return (openEvents.length > 0) ? '#dc172a' : '#7dc540';
}

function title(events, eventType) {
  const name = eventType || S(events[0].eventType).humanize().titleCase().s;
  const root = (_.find(events, { isRootCause: true })) ? ':zap:' : '';
  return `${name} ${root}`.trim();
}

function DEFAULT(events, eventType) {
  const out = new VB.Card();
  const oField = openField(events);

  out
    .addTitle(title(events, eventType))
    .setColor(color(events))
    .addField(oField.title, oField.value, true);

  if (events[0].affectedUserActionsPerMinute) {
    const arpm = _.sumBy(events, 'affectedUserActionsPerMinute') / events.length;
    out.addField('Affected User Actions/Minute', `${arpm.toFixed(2)}`, true);
  }

  if (events[0].affectedRequestsPerMinute) {
    const arpm = _.sumBy(events, 'affectedRequestsPerMinute') / events.length;
    out.addField('Affected Requests/Minute', `${arpm.toFixed(2)}`, true);
  }

  const locations = _.filter(_.uniq(_.map(events, e => e.geolocation)));
  if (locations.indexOf('All') !== -1) {
    out.addField('GeoLocations', 'All', true);
  } else if (locations.length > 0) {
    out.addField('GeoLocations', locations.join(', '), true);
  }

  const browsers = _.filter(_.uniq(_.map(events, e => e.browser)));
  if (browsers.indexOf('All') !== -1) {
    out.addField('Browsers', 'All', true);
  } else if (browsers.length > 0) {
    out.addField('Browsers', browsers.join(', '), true);
  }

  const operatingSystems = _.filter(_.uniq(_.map(events, e => e.operatingSystem)));
  if (operatingSystems.indexOf('All') !== -1) {
    out.addField('Operating Systems', 'All', true);
  } else if (operatingSystems.length > 0) {
    out.addField('Operating Systems', operatingSystems.join(', '), true);
  }

  return out;
}

module.exports = {
  // Default handler is always called, then is passed
  // to the other handlers as 'base' if they exist.
  // To keep the default output, simply return base

  // these are unchanged from default
  CONNECTION_LOST: (events, base) => base,
  FAILURE_RATE_INCREASED: (events, base) => base,
  HIGH_CONNECTIVITY_FAILURES: (events, base) => base,
  HIGH_NETWORK_LOSS_RATE: (events, base) => base,
  JAVSCRIPT_ERROR_RATE_INCREASED: (events, base) => base,
  MOBILE_APP_CRASH_RATE_INCREASED: (events, base) => base,
  PROCESS_LOG_ERROR: (events, base) => base,
  SERVICE_RESPONSE_TIME_DEGRADED: (events, base) => base,
  SYNTHETIC_SLOWDOWN: (events, base) => base,
  UNEXPECTED_LOW_LOAD: (events, base) => base,
  USER_ACTION_DURATION_DEGRADATION: (events, base) => base,
  WEB_CHECK_GLOBAL_OUTAGE: (events, base) => base,

  // these are unchanged from default except for the title
  CPU_SATURATED: (events) => DEFAULT(events, 'CPU Saturated'),
  ELASTIC_LOAD_BALANCER_HIGH_BACKEND_FAILURE_RATE: (events) => DEFAULT(events, 'ELB High Backend Failure Rate'),
  PGI_OF_SERVICE_UNAVAILABLE: (events) => DEFAULT(events, 'Service Process Group Instance Unavailable'),

  // Custom handlers
  // Nothing is custom right now but we can add it in the future

  DEFAULT,
};

