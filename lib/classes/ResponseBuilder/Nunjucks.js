'use strict';

const nunjucks = require('nunjucks');
const _ = require('lodash');
const moment = require('moment-timezone');

require('moment-round');

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
    this.env.addFilter('friendlyApplicationName', this.friendlyApplicationName);
    this.env.addFilter('friendlyEntityName', this.friendlyEntityName);
    this.env.addFilter('friendlyStatus', this.friendlyStatus);
    this.env.addFilter('time', this.time);

    this.davis = davis;
  }

  /**
   * Loads the template and creates a response using the context data
   *
   * @param {string} template - The name of the template.
   * @param {Object} context - The data used to combined with the template.
   * @returns
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
   * @returns
   *
   * @memberOf Nunjucks
   */
  renderString(string, context) {
    return this.env.renderString(string, context);
  }

  /**
   * Entity's alias if one exists under demo/aliases/applications.js
   * @param {Object} name
   * @param {String} displayType - undefined, 'audible' or 'visual'
   * @return {String}
   */
  friendlyApplicationName(name, displayType) {
    displayType = displayType || 'audible';
    return getFriendlyEntityName(aliases, 'applications', name, displayType);
  }

  /**
   * Entity's alias if one exists under demo/aliases/
   * @param {Object} entity
   * @param {String} displayType - undefined, 'audible' or 'visual'
   * @return {String} getFriendlyEntityName()
   */
  friendlyEntityName(entity, displayType) {
    displayType = displayType || 'audible';
    return getFriendlyEntityName(aliases, getEntityType(entity), entity.entityName, displayType);
  }

  /**
   * Friendly problem status
   * @param {String} status - OPEN or CLOSED
   */
  friendlyStatus(status) {
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
  time(time, user, displayType) {
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

  /**
   * Formatted version of a date with time rounded down to nearest multiple of 5
   * taking into account the user's timezone
   * @param {String} time
   * @param {Object} user
   * @param {String} displayType - undefined, 'audible' or 'visual'
   * @return {String} moment.tz().floor().cal() - Moment JS timezone, floor, and calendar format
   */
  friendlyTime(time, user, displayType) {
    if (displayType === 'visual') {
      return moment.tz(time, user.timezone).floor(5, 'minutes').calendar(null, {
        sameDay: '[around] h:mm A z',
        lastDay: '[yesterday around] h:mm A z',
        lastWeek: 'dddd [around] h:mm A z',
      });
    }
    return moment.tz(time, user.timezone).floor(5, 'minutes').calendar(null, {
      sameDay: '[around] h:mm A',
      lastDay: '[yesterday around] h:mm A',
      lastWeek: 'dddd [around] h:mm A',
    });
  }
}

module.exports = Nunjucks;
