'use strict';

const DError = require('./Error').DError;
const _ = require('lodash');
const moment = require('moment-timezone');
const rp = require('request-promise');

class Dynatrace {
  constructor(davis) {
    this.logger = davis.logger;
    this.config = davis.config;
    this.event = davis.event;

    this.url = `${this.config.getDynatraceUrl()}/api/v1/`;
    this.key = this.config.getDynatraceKey();
    this.validateCerts = this.config.getDynatraceValidateCert();

    this.options = (url, parameters) => {
      const option = {
        uri: this.url + url,
        strictSSL: this.validateCerts,
        qs: parameters || {},
        headers: {
          Authorization: `Api-Token ${this.key}`,
        },
        json: true,
        transform: (body, response) => {
          // Adds response time information to logs
          this.logger.info(`DYNATRACE API: ${response.req.path.split('?')[0]} \
            ${response.statusCode} - ${response.elapsedTime} ms`);
          return body;
        },
        time: true,
      };
      return option;
    };
  }

  /**
   * Creates a standard time range object
   * @params {Object} datetime - The datetime object received from parser
   * @returns {Object} time range
   * @static
   */
  static generateTimeRange(datetime) {
    let timeRange;

    try {
      if (_.isEmpty(datetime)) {
        return null;
      } else if (datetime.type === 'value') {
        switch (datetime.grain) {
          case 'second':
          case 'minute':
            timeRange = {
              startTime: moment.parseZone(datetime.value).subtract(5, 'minutes'),
              stopTime: moment.parseZone(datetime.value).add(5, 'minutes'),
            };
            break;
          case 'hour':
            timeRange = {
              startTime: moment.parseZone(datetime.value).subtract(15, 'minutes'),
              stopTime: moment.parseZone(datetime.value).add(15, 'minutes'),
            };
            break;
          case 'day':
            timeRange = {
              startTime: moment.parseZone(datetime.value).startOf('day'),
              stopTime: moment.parseZone(datetime.value).endOf('day'),
            };
            break;
          case 'week':
            timeRange = {
              startTime: moment.parseZone(datetime.value).startOf('week'),
              stopTime: moment.parseZone(datetime.value).endOf('week'),
            };
            break;
          case 'month':
            timeRange = {
              startTime: moment.parseZone(datetime.value).startOf('month'),
              stopTime: moment.parseZone(datetime.value).endOf('month'),
            };
            break;
          case 'year':
            timeRange = {
              startTime: moment.parseZone(datetime.value).startOf('year'),
              stopTime: moment.parseZone(datetime.value).endOf('year'),
            };
            break;
          default:
            this.logger.error(`Passed in an unknown granularity: ${datetime.grain}`);
        }
      } else if (datetime.type === 'interval') {
        // Checks if this is an open ended interval
        if (datetime.to) {
          timeRange = {
            startTime: datetime.from.value,
            stopTime: datetime.to.value,
          };
        } else {
          timeRange = {
            startTime: datetime.from.value,
            stopTime: moment().format(),
          };
        }
      }
    } catch (e) {
      throw new DError('Unable to extract a time range!');
    }
    return timeRange;
  }

  /** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** **
   *            Topology and Smartscape API Section
   *
   *   https://help.dynatrace.com/api-documentation/v1/topology/
   *
   ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** **/
  getAllEntities() {
    return rp(this.options('entity'));
  }

  getApplicationEntities() {
    return rp(this.options('entity/applications'));
  }

  getServiceEntities() {
    return rp(this.options('entity/services'));
  }

  getInfrastructureEntities() {
    return rp(this.options('infrastructure/hosts'));
  }

  /** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** **
   *                   Problem API Section
   *
   *   https://help.ruxit.com/api-documentation/v1/problems/
   *
   ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** **/

  /**
   * @returns {Object} - a high level summary of problems
   */
  problemStatus() {
    return rp(this.options('problem/status'));
  }

  /**
   * @param {Object} [parameters] - Key/Value pair that becomes part of the query string
   * @returns {Object} - Problem feed
   */
  problemFeed(parameters) {
    return rp(this.options('problem/feed', parameters || {}));
  }

  /**
   * @param {string} problemId - The specific ID of a problem.
   * @returns {Object} - Problem details
   */
  problemDetails(problemId) {
    if (typeof problemId === 'undefined') {
      throw new DError('You must provide a problem ID!');
    }
    return rp(this.options(`problem/details/${problemId}`));
  }

  /**
   * @returns {Object} - Active problems only
   */
  activeProblems() {
    return rp(this.options('problem/feed', { status: 'open' }));
  }

  /** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** **
   *                   Timeseries API Section
   *
   *   https://help.ruxit.com/api-documentation/v1/timeseries/
   *
   ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** **/
  /**
   * @param {Object} [parameters] - Key/Value pair that becomes part of the query string
   * @returns {Object} - Timeseries data
   */
  getTimeseriesData(parameters) {
    return rp(this.options('timeseries', parameters || {}));
  }

}

module.exports = Dynatrace;
