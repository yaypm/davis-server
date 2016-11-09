'use strict';

const nunjucks = require('nunjucks');
const _ = require('lodash');
const moment = require('moment-timezone');
const S = require('string');
const events = require('../../Dynatrace/events');

require('moment-round');

// Date formatting
const startFormat = {
  normal: {
    sameDay: '[today] h:mm A',
    lastDay: '[yesterday] h:mm A',
    lastWeek: 'dddd [at] h:mm A',
    sameElse: 'MM/DD/YYYY [at] h:mm A',
  },
  between: {
    sameDay: '[today between] h:mm A',
    lastDay: '[yesterday between] h:mm A',
    lastWeek: '[between] dddd [at] h:mm A',
    sameElse: '[between] MM/DD/YYYY [at] h:mm A',
  },
};

const stopFormat = {
  normal: {
    sameDay: '[today] h:mm A',
    lastDay: '[yesterday] h:mm A',
    lastWeek: 'dddd [at] h:mm A',
    sameElse: 'MM/DD/YYYY [at] h:mm A',
  },
  sameday: {
    sameDay: 'h:mm A',
    lastDay: 'h:mm A',
    lastWeek: 'dddd [at] h:mm A',
    sameElse: 'MM/DD/YYYY [at] h:mm A',
  },
};

/**
 * Entity's alias if one exists under demo/aliases/applications.js
 * @param {Object} name
 * @param {String} displayType - undefined, 'audible' or 'visual'
 * @return {String}
 */
function friendlyApplicationName(name, displayType) {
  const type = displayType || 'audible';
  return getFriendlyEntityName(aliases, 'applications', name, type);
}

/**
 * Entity's alias if one exists under demo/aliases/
 * @param {Object} entity
 * @param {String} displayType - undefined, 'audible' or 'visual'
 * @return {String} getFriendlyEntityName()
 */
function friendlyEntityName(entity, displayType) {
  // const type = displayType || 'audible';
  return entity.entityName;
  // return this.getFriendlyEntityName(aliases, getEntityType(entity), entity.entityName, type);
}

function friendlyEvent(eventName) {
  const event = _.find(events, e => e.name === eventName);

  if (_.isNil(event)) {
    this.davis.logger.warn(`unable to find a friendly event for ${eventName}`);
    return S(eventName).humanize().s.toLowerCase();
  }
  return _.sample(event.friendly);
}

/**
 * Friendly problem status
 * @param {String} status - OPEN or CLOSED
 */
function friendlyStatus(status) {
  let response;
  if (status.toUpperCase() === 'OPEN') {
    response = _.sample(['ongoing', 'active']);
  } else {
    response = _.sample(['closed', 'finished']);
  }
  return response;
}

/**
 * Formatted version of a date, taking into account the user's timezone
 * @param {String} time
 * @param {Object} user
 * @param {String} displayType - undefined, 'audible' or 'visual'
 * @return {String} moment.tz().cal() - Moment JS timezone and calendar format
 */
function time(time, user, displayType) {
  if (displayType === 'visual') {
    return moment.tz(time, user.timezone).calendar(null, {
      sameDay: '[today at] h:mm A z',
      lastDay: '[yesterday at] h:mm A z',
      lastWeek: 'dddd [at] h:mm A z',
    });
  }
  return moment.tz(time, user.timezone).calendar(null, {
    sameDay: '[today at] h:mm A',
    lastDay: '[yesterday at] h:mm A',
    lastWeek: 'dddd [at] h:mm A',
  });
}

function capitalizeFirstCharacter(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function capitalizeFirstCharacters(text) {
  let title = text;
  const titleArray = title.split(' ');
  if (titleArray[0] === 'a') {
    titleArray[0] = '';
  }
  title = '';
  titleArray.forEach((word) => {
    title += `${capitalizeFirstCharacter(word)} `;
  });
  return title.trim();
}

/**
 * Formatted version of a date with time rounded down to nearest multiple of 5
 * taking into account the user's timezone
 * @param {String} time
 * @param {Object} user
 * @param {String} displayType - undefined, 'audible' or 'visual'
 * @return {String} moment.tz().floor().cal() - Moment JS timezone, floor, and calendar format
 */
function friendlyTime(timeExpression, user, displayType) {
  if (displayType === 'visual') {
    return moment.tz(timeExpression, user.timezone).floor(5, 'minutes').calendar(null, {
      sameDay: '[around] h:mm A z',
      lastDay: '[yesterday around] h:mm A z',
      lastWeek: 'dddd [around] h:mm A z',
    });
  }
  return moment.tz(timeExpression, user.timezone).floor(5, 'minutes').calendar(null, {
    sameDay: '[around] h:mm A',
    lastDay: '[yesterday around] h:mm A',
    lastWeek: 'dddd [around] h:mm A',
  });
}

function friendlyTimeRange(timeRange, user, isCompact, displayType) {
  const type = displayType || 'audible';
  let timezone = '';
  if (type === 'visual') {
    timezone = `${moment.tz(user.timezone).format('z')}`;
  }
  let sentence = (isCompact) ? capitalizeFirstCharacter(moment.tz(timeRange.startTime, user.timezone).calendar(null, startFormat.normal)).trim() + timezone : moment.tz(timeRange.startTime, user.timezone).calendar(null, startFormat.between).trim() + timezone;
  if (timeRange.stopTime > timeRange.startTime) {
    if (moment.duration(moment.tz(timeRange.stopTime, user.timezone).diff(moment.tz(timeRange.startTime, user.timezone), 'hours')) < 24) {
      sentence += (isCompact) ? ' - ' : ' and ';
      sentence += (isCompact) ? capitalizeFirstCharacter(moment.tz(timeRange.stopTime, user.timezone).calendar(null, stopFormat.sameday)).trim() + timezone : moment.tz(timeRange.stopTime, user.timezone).calendar(null, stopFormat.sameday).trim() + timezone;
    } else {
      sentence += (isCompact) ? ' - \\n' : ' and ';
      sentence += (isCompact) ? capitalizeFirstCharacter(moment.tz(timeRange.stopTime, user.timezone).calendar(null, stopFormat.normal)).trim() + timezone : moment.tz(timeRange.stopTime, user.timezone).calendar(null, stopFormat.normal).trim() + timezone;
    }
  }
  return sentence;
}

class Nunjucks {
  constructor(davis) {
    this.logger = davis.logger;

    // TODO: Investigate settings a FileSystemLoader - https://mozilla.github.io/nunjucks/api.html#loader
    this.env = new nunjucks.Environment(
      [
        new nunjucks.FileSystemLoader(),
      ], {
        autoescape: false,
        trimBlocks: true,
        lstripBlocks: true,
      });

    // Registers custom filters from Nunjucks.
    this.env.addFilter('friendlyApplicationName', friendlyApplicationName);
    this.env.addFilter('friendlyEntityName', friendlyEntityName);
    this.env.addFilter('friendlyStatus', friendlyStatus);
    this.env.addFilter('time', time);
    this.env.addFilter('friendlyEvent', friendlyEvent);
    this.env.addFilter('friendlyTime', friendlyTime);
    this.env.addFilter('friendlyTimeRange', friendlyTimeRange);

    this.davis = davis;
  }

  /**
   * Loads the template and creates a response using the context data
   *
   * @param {string} template - The name of the template.
   * @param {Object} context - The data used to combined with the template.
   * @returns {String}
   *
   * @memberOf Nunjucks
   */
  render(template, context) {
    return this.env.render(template, context);
  }

  /**
   * Renders the string as a template using the context data
   *
   * @param {string} string - A raw string template
   * @param {Object} context - The data used to combined with the template.
   * @returns {String}
   *
   * @memberOf Nunjucks
   */
  renderString(string, context) {
    return this.env.renderString(string, context);
  }
}

module.exports = Nunjucks;
