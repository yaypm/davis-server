'use strict';

const _ = require('lodash');
const moment = require('moment-timezone');
const rp = require('request-promise');
const BbPromise = require('bluebird');
const Problems = require('./Problems');
const events = require('./events');

class Dynatrace {
  constructor(davis) {
    this.logger = davis.logger;
    this.config = davis.config;
    this.event = davis.event;
    this.events = events;

    this.davis = davis;
  }

  _get(url, parameters) {
    const baseUrl = this.config.getDynatraceApiUrl();

    return this._interact({
      uri: `${baseUrl}/api/v1/${url}`,
      qs: parameters || {},
    });
  }

  _post(url, body) {
    const baseUrl = this.config.getDynatraceApiUrl();

    return this._interact({
      method: 'POST',
      uri: `${baseUrl}/api/v1/${url}`,
      body,
    });
  }

  _interact(options) {
    const apiToken = this.config.getDynatraceToken();
    const validateCerts = this.config.getDynatraceValidateCert();

    _.merge(options, {
      strictSSL: validateCerts,
      headers: {
        Authorization: `Api-Token ${apiToken}`,
      },
      json: true,
      timeout: 20000,
      transform: (body, response) => {
        // Adds response time information to logs
        const path = response.req.path.split('?')[0];
        this.logger.info(`DYNATRACE API: ${path} ${response.statusCode} - ${response.elapsedTime} ms`);
        return body;
      },
      time: true,
    });

    return BbPromise.try(() => {
      if (_.isEmpty(apiToken)) throw new this.davis.classes.Error('The Dynatrace API token is undefined!');
    })
      .then(() => rp(options))
      .catch((err) => {
        if (err.statusCode === 400) {
          if (_.has(err, 'response.error.message')) {
            throw new this.davis.classes.Error(`Unable to contact Dynatrace!  ${err.response.error.message}`);
          }
          throw new this.davis.classes.Error('Unable to contact Dynatrace!  Are you sure you set the correct URL?');
        } else if (err.statusCode === 401) {
          throw new this.davis.classes.Error('The configured Dynatrace API token is invalid!');
        } else if (err.name === 'DavisError') {
          throw err;
        } else {
          this.logger.error(`Dynatrace responded with an unhandled status code of ${err.statusCode}.`);
          throw new this.davis.classes.Error('Unfortunately, there was an issue communicating with Dynatrace.');
        }
      });
  }

  /** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** **
   *            Topology and Smartscape API Section
   *
   *   https://help.dynatrace.com/api-documentation/v1/topology/
   *
   ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** **/
  getAllEntities() {
    return this._get('entity');
  }

  getApplicationEntities() {
    return this._get('entity/applications');
  }

  getServiceEntities() {
    return this._get('entity/services');
  }

  getInfrastructureEntities() {
    return this._get('infrastructure/hosts');
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
    return this._get('problem/status');
  }

  /**
   * @param {Object} [parameters] - Key/Value pair that becomes part of the query string
   * @returns {Object} - Problem feed
   */
  problemFeed(parameters) {
    return this._get('problem/feed', parameters);
  }

  /**
   * @param {string} problemId - The specific ID of a problem.
   * @returns {Object} - Problem details
   */
  problemDetails(problemId) {
    return BbPromise.try(() => {
      if (typeof problemId === 'undefined') {
        throw new this.davis.classes.Error('You must provide a problem ID!');
      }
    }).then(() => this._get(`problem/details/${problemId}`));
  }

  /**
   * @param {string} problemId - The specific ID of a problem.
   * @returns {Object} - Comments
   */
  getCommentsOnProblem(problemId) {
    return BbPromise.try(() => {
      if (typeof problemId === 'undefined') {
        throw new this.davis.classes.Error('You must provide a problem ID!');
      }
    }).then(() => this._get(`problem/details/${problemId}/comments`));
  }

  /**
   * @param {Object} exchange - The current exchange object.
   * @param {string} problemId - The specific ID of a problem.
   * @param {string} comment - The comment you would like to add to the problem.
   * @returns {Promise}
   */
  addCommentToProblem(exchange, problemId, comment) {
    const context = `Davis - ${exchange.getRequestSource()}`;
    return BbPromise.try(() => {
      if (typeof problemId === 'undefined') {
        throw new this.davis.classes.Error('You must provide a problem ID!');
      } else if (typeof comment === 'undefined') {
        throw new this.davis.classes.Error('You must provide a comment!');
      }
    }).then(() => this._post(`problem/details/${problemId}/comments`, { comment, user: exchange.getUserIdentifier(), context }));
  }

  /**
   * @returns {Object} - Active problems only
   */
  activeProblems() {
    return this._get('problem/feed', { status: 'open' });
  }


  getFilteredProblemsDay(exchange) {
    const app = _.get(exchange, 'model.request.analysed.app');
    const filter = { relativeTime: 'day' };

    return BbPromise.resolve()
      .then(() => this.problemFeed(filter))
      .then(res => res.result.problems)
      .then(problems => this._filterProblemsByDavisFilters(exchange, problems))
      .then(problems => this._filterProblemsByApps(app, problems))
      .then((problems) => {
        this.logger.debug(`The post-filtered problem list is ${problems.length}.`);
        return new Problems(this.davis, problems, false);
      });
  }

  getFilteredProblems(exchange, forceFilter) {
    const timerange = _.get(exchange, 'model.request.analysed.timeRange', {});
    const app = _.get(exchange, 'model.request.analysed.app', {});
    const filter = forceFilter || {};

    if (_.isNil(forceFilter)) {
      if (_.isNil(timerange.startTime)) {
        filter.status = 'OPEN';
      } else {
        filter.relativeTime = this._getTimeFilter(timerange.startTime);
        this.logger.debug(`Getting problems for the past ${filter.relativeTime} from the Dynatrace API.`);
      }
    }

    return BbPromise.resolve()
      .then(() => this.problemFeed(filter))
      .then(res => res.result.problems)
      .then((problems) => {
        this.logger.debug(`The pre-filtered problem list is ${problems.length}.`);
        return this._filterProblemsByTime(timerange, problems);
      })
      .then(problems => (app.name) ? problems : this._filterProblemsByDavisFilters(exchange, problems))
      .then(problems => this._filterProblemsByApps(app, problems))
      .then((problems) => {
        this.logger.debug(`The post-filtered problem list is ${problems.length}.`);
        return new Problems(this.davis, problems);
      });
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
    return this._get('timeseries', parameters);
  }

  getFilteredTimeseriesData(exchange, parameters) {
    // TODO add global filtering options
    const timerange = _.get(exchange, 'model.request.analysed.timeRange', {});
    const filter = {};

    if (_.isNil(timerange.startTime)) {
      filter.relativeTime = parameters.relativeTime || 'day';
      _.set(exchange, 'model.request.analysed.timeRange.startTime', moment().subtract(1, 'd').valueOf());
      _.set(exchange, 'model.request.analysed.timeRange.stopTime', moment().valueOf());
    } else {
      filter.startTimestamp = timerange.startTime;
      filter.endTimestamp = timerange.stopTime;
    }

    // Allows users to override the default settings if they want.
    _.assign(filter, parameters);

    return BbPromise.try(() => {
      if (!_.isString(parameters.timeseriesId)) {
        throw new this.davis.classes.Error('You must provide a timeseries ID!');
      }
    })
    .then(() => this.getTimeseriesData(filter));
  }

  /** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** **
   *                    Helper functions
   *
   ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** **/

  /**
   * Used to create a query string parameter object for relative time
   *
   * @param {(string|Object<Moment>)} [start] - The starting timestamp for the problems you're interested in
   * @returns {{relativeTime: *}} Returns a time filter that can be passed in a Dynatrace API request.
   *
   */
  _getTimeFilter(start) {
    const startTime = (start) ? moment(start) : moment().subtract(10, 'minutes');
    const diff = moment().diff(startTime, 'minutes');

    let relativeTime;
    if (diff <= 60) {
      relativeTime = 'hour';
    } else if (diff <= 120) {
      relativeTime = '2hours';
    } else if (diff <= 360) {
      relativeTime = '6hours';
    } else if (diff <= 1440) {
      relativeTime = 'day';
    } else if (diff <= 10080) {
      relativeTime = 'week';
    } else if (diff <= 44640) {
      relativeTime = 'month';
    } else {
      this.logger.warn('The user has requested data older than a month.');
      relativeTime = 'month';
    }

    return relativeTime;
  }

  _filterProblemsByTime(timerange, problems) {
    // No need to filter if a timerange wasn't provided
    if (_.isNil(timerange)) return problems;

    const filteredProblems = _.filter(problems, problem => this._isProblemInRange(timerange.startTime, timerange.stopTime, problem.startTime, problem.endTime));
    return filteredProblems;
  }

  _filterProblemsByDavisFilters(exchange, problems) {
    return this.davis.filters.getFiltersByScope(exchange.getScope(), 'QUESTION')
      .then((filters) => {
        if (filters.length > 0) {
          this.logger.debug(`Evaluating ${filters.length} filter(s).`);
          exchange.filtered = true;
          return _.filter(problems, (problem) => {
            for (const filter of filters) {
              if (filter.problemMatch(problem)) {
                this.logger.debug(`The filter '${filter.name}' matched ${problem.id}.`);
                return true;
              }
            }
            return false;
          });
        }
        this.logger.debug('No filter found.');
        return problems;
      });
  }

  _filterProblemsByApps(inp, res) {
    const app = inp || {};
    const name = app.name;
    if (_.isNil(name)) return res;

    const problems = _.filter(res, (problem) => {
      let impacted = false;
      const impacts = _.filter(problem.rankedImpacts, impact => impact.entityName === name);
      if (impacts.length !== 0) {
        impacted = true;
      }
      return impacted;
    });
    this.logger.debug(`Filtering problems by app: ${name}.`);
    return problems;
  }

  /**
  * Used to check if a problem was active during a certain time frame
  *
  * @param {(string|Object<Moment>)} requestStart - The start of the time range
  * @param {(string|Object<Moment>)} requestStop - The end of the time range
  * @param {(string|Object<Moment>)} problemStart - The start of the problem
  * @param {(string|Object<Moment>)} [problemStop] - The end of the problem
  * @returns {boolean} Returns true if a problem was active during the range
  *
  */
  _isProblemInRange(requestStart, requestStop, problemStart, problemStop) {
    const momentRequestStart = moment(requestStart);
    const momentRequestStop = moment(requestStop);
    const momentProblemStart = moment(problemStart);

    if (_.isNil(problemStop) || problemStop === -1) {
      return momentProblemStart.isSameOrBefore(requestStop);
    }

    const momentProblemStop = moment(problemStop);
    return momentRequestStart.isSameOrBefore(momentProblemStop)
      && momentRequestStop.isSameOrAfter(momentProblemStart);
  }
}

module.exports = Dynatrace;
