'use strict';

const DError = require('./Error').DError;
const _ = require('lodash');
const moment = require('moment-timezone');
const rp = require('request-promise');
const BbPromise = require('bluebird');

class Dynatrace {
  constructor(davis) {
    this.logger = davis.logger;
    this.config = davis.config;
    this.event = davis.event;

    this.davis = davis;
  }

  _interact(url, parameters) {
    const baseUrl = this.config.getDynatraceUrl();
    const apiToken = this.config.getDynatraceToken();
    const validateCerts = this.config.getDynatraceValidateCert();

    const options = {
      uri: `${baseUrl}/api/v1/${url}`,
      strictSSL: validateCerts,
      qs: parameters || {},
      headers: {
        Authorization: `Api-Token ${apiToken}`,
      },
      json: true,
      transform: (body, response) => {
        // Adds response time information to logs
        const path = response.req.path.split('?')[0];
        this.logger.info(`DYNATRACE API: ${path} ${response.statusCode} - ${response.elapsedTime} ms`);
        return body;
      },
      time: true,
    };

    return BbPromise.try(() => {
      if (_.isEmpty(baseUrl)) throw new DError('The Dynatrace URL is undefined!');
      if (_.isEmpty(apiToken)) throw new DError('The Dynatrace API token is undefined!');
    })
      .then(() => rp(options))
      .catch(err => {
        if (err.statusCode === 400) {
          throw new DError('Unable to contact Dynatrace!  Are you sure you set the correct URL?');
        } else if (err.statusCode === 401) {
          throw new DError('The configured Dynatrace API token is invalid!');
        } else if (err.name === 'DavisError') {
          throw err;
        } else {
          this.logger.error(`Dynatrace responded with an unhandled status code of ${err.statusCode}.`);
          throw new DError('Unfortunately, there was an issue communicating with Dynatrace.');
        }
      });
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
    return this._interact('entity');
  }

  getApplicationEntities() {
    return this._interact('entity/applications');
  }

  getServiceEntities() {
    return this._interact('entity/services');
  }

  getInfrastructureEntities() {
    return this._interact('infrastructure/hosts');
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
    return this._interact('problem/status');
  }

  /**
   * @param {Object} [parameters] - Key/Value pair that becomes part of the query string
   * @returns {Object} - Problem feed
   */
  problemFeed(parameters) {
    return this._interact('problem/feed', parameters);
  }

  /**
   * @param {string} problemId - The specific ID of a problem.
   * @returns {Object} - Problem details
   */
  problemDetails(problemId) {
    return BbPromise.try(() => {
      if (typeof problemId === 'undefined') {
        throw new DError('You must provide a problem ID!');
      }
    }).bind(this)
      .then(() => this._interact(`problem/details/${problemId}`));
  }

  getCommentsOnProblem(problemId) {
    return BbPromise.try(() => {
      if (typeof problemId === 'undefined') {
        throw new DError('You must provide a problem ID!');
      }
    }).bind(this)
      .then(() => this._interact(`problem/details/${problemId}/comments`));
  }

  addCommentToProblem(problemId, comment, user, source) {
    /* TODO: Add comment method
    METHOD: POST
    URI: /api/v1/problem/details/${problemId}/comments
    BODY: {
      comment,
      user,
      context: `Davis - ${source}`
    }
    */
  }

  /**
   * @returns {Object} - Active problems only
   */
  activeProblems() {
    return this._interact('problem/feed', { status: 'open' });
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
    return this._interact('timeseries', parameters);
  }

}

module.exports = Dynatrace;
