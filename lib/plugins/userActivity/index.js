'use strict';

const _ = require('lodash');
const BbPromise = require('bluebird');
const AliasModel = require('../../models/Aliases');

class UserActivity {
  constructor(davis, options) {
    this.davis = davis;
    this.options = options;

    this.intents = {
      userActivity: {
        usage: 'Ask about current activity levels',
        phrases: [
          'can you tell me about user activity levels {{DATETIME}}?',
          'give me an update on user activity',
          'use activity {{APP}} {{DATETIME}}',
          'user activity {{APP}} {{DATETIME}}',
        ],
        lifecycleEvents: [
          'userActivity',
        ],
      },
    };

    this.hooks = {
      'userActivity:userActivity': exchange => {
        const nlp = exchange.getNlpData();
        const app = _.get(nlp, 'app.name');

        const params = {
          timeseriesId: 'com.dynatrace.builtin:app.useractionsperminute',
          queryMode: 'series',
          aggregationType: 'count',
        };

        return this.davis.dynatrace.getFilteredTimeseriesData(exchange, params)
          .then(result => {
            const dataPoints = result.result.dataPoints;
            return (_.isNil(app)
              ? BbPromise.resolve([dataPoints])
              : BbPromise.resolve([dataPoints, AliasModel.findOne({ name: app }).exec()]));
          })
          .spread((data, entity) => {
            if (_.isNil(entity)) {
              return this.noAppResponse(exchange, data);
            }
            return this.appResponse(exchange, data, entity);
          });
      },
    };
  }

  appResponse(exchange, data, app) {
    const name = app.name;
    const eId = app.entityId;

    const stats = this.extract(data, eId);
    stats.appName = name;

    exchange.addContext(stats);
    const templates = this.davis.pluginManager.responseBuilder.getTemplates(this);
    exchange.response(templates);
  }

  noAppResponse(exchange, data) {
    this.davis.logger.debug('No app found, searching for application with highest activity.');
    const means = _.mapValues(data, app => _.meanBy(app, dp => dp[1]));
    const bigApp = _.max(Object.keys(means), o => means[o]);
    const stats = this.extract(data, bigApp);
    if (_.isNil(stats)) {
      return exchange.response('No user activity data found.').skipFollowUp();
    }
    return BbPromise
      .resolve(AliasModel.findOne({ entityId: bigApp }).exec())
      .then(app => {
        stats.appName = app.name;
        const templates = this.davis.pluginManager.responseBuilder.getTemplates(this, 'noApp');
        exchange.response(templates);
      });
  }

  extract(data, appId) {
    const appData = data[appId];

    if (_.isNil(appData)) {
      return null;
    }
    const activity = _.map(appData, dp => [dp[0], Number(dp[1])]);
    const min = _.minBy(activity, dp => dp[1]);
    const max = _.maxBy(activity, dp => dp[1]);
    const mean = _.meanBy(activity, dp => dp[1]);
    return {
      averageUsers: _.round(mean),
      minUsers: _.round(min[1]),
      minTime: min[0],
      maxUsers: _.round(max[1]),
      maxTime: max[0],
    };
  }
}

module.exports = UserActivity;
