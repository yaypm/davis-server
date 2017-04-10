'use strict';

const _ = require('lodash');

class UserActivityPrediction {
  constructor(davis, options) {
    this.davis = davis;
    this.options = options;

    this.intents = {
      userActivityPrediction: {
        usage: 'Ask about current activity levels',
        examples: [
          'Tell me how many user actions there will be on my application.',
          'What level of user activity should I expect for my application?',
        ],
        phrases: [
          'what level of user activity should I expect for {{APP}}',
          'tell me how many user actions there will be on {{APP}}',
        ],
        lifecycleEvents: [
          'userActivityPrediction',
        ],
        clarification: 'I think you were asking about predicting user activity for the near future.',
      },
    };

    this.hooks = {
      'userActivityPrediction:userActivityPrediction': (exchange) => {
        const nlp = exchange.getNlpData();

        const params = {
          timeseriesId: 'com.dynatrace.builtin:app.useractionsperminute',
          relativeTime: '30mins',
          queryMode: 'series',
          aggregationType: 'count',
          entity: _.get(nlp, 'app.app.entityId'),
          predict: 'true',
        };

        return this.davis.dynatrace.getFilteredTimeseriesData(exchange, params)
          .then((result) => {
            const entities = Object.keys(result.entities);
            const numApps = entities.length;
            const appName = _.get(nlp, 'app.name') || (numApps === 1) ? result.entities[entities[0]] : null;
            if (appName) {
              const entity = _.find(this.davis.pluginManager.entities.applications, { name: appName });
              return this.appResponse(exchange, result, entity);
            }
            return this.noAppResponse(exchange, result);
          });
      },
    };
  }

  appResponse(exchange, data, app) {
    const VB = this.davis.classes.VB;
    const th = this.davis.textHelpers;
    const stats = data.stats[app.entityId];

    const nlp = exchange.getNlpData();


    if (data.stats.maxMean.value === 0) {
      return this.noActivity(exchange, app);
    }

    const timeRange = "In the next half hour, ";
    const alias = new VB.Alias(app);
    const mints = new VB.TimeStamp(stats.minTime, exchange.user.timezone, null, true);
    const maxts = new VB.TimeStamp(stats.maxTime, exchange.user.timezone, null, true);

    const text = [timeRange, alias, 'will likely experience an average load of about',
      stats.average, 'user actions', 'per minute. The greatest load should be near',
      stats.max, 'user actions per', 'minute at about', maxts, '.',
      'The least active time should be around', mints, 'when approximately', stats.min,
      'user actions should occur.'];

    const out = {
      say: VB.audible(text),
      show: VB.stringify(text),
      text: VB.slackify(text),
    };

    return exchange
      .setLinkUrl(this.davis.linker.userActivity(app.entityId, exchange.getTimeRange()))
      .response(out);
  }

  noAppResponse(exchange, data) {
    const VB = this.davis.classes.VB;
    const th = this.davis.textHelpers;
    const nlp = exchange.getNlpData();
    this.davis.logger.debug('No app found, searching for application with highest predicted user activity.');
    if (data.stats.maxMean.value === 0) {
      return this.noActivity(exchange);
    }

    const entities = data.entities;
    const bigApp = _.get(data, 'stats.maxMean.entity');

    if (_.isNil(bigApp)) {
      return exchange.response('No user activity data found.').skipFollowUp();
    }

    const stats = data.stats[bigApp];

    const app = _.find(this.davis.pluginManager.entities.applications, { entityId: bigApp });

    const timeRange = "In the next half hour, ";
    const alias = app ? new VB.Alias(app) : entities[bigApp];
    const mints = new VB.TimeStamp(stats.minTime, exchange.user.timezone, null, true);
    const maxts = new VB.TimeStamp(stats.maxTime, exchange.user.timezone, null, true);

    const text = [timeRange, alias, 'will likely be the most active application,',
      'experiencing an average load of about', stats.average, 'user actions',
      'per minute. The greatest load should be near', stats.max, 'user actions per',
      'minute at about', maxts, '.', 'The least active time should be around', mints, 'when approximately',
      stats.min, 'user actions should occur.'];

    const out = {
      say: VB.audible(text),
      show: VB.stringify(text),
      text: VB.slackify(text),
    };

    return exchange
      .setLinkUrl(this.davis.linker.userActivity(bigApp, exchange.getTimeRange()))
      .response(out);
  }

  noActivity(exchange, app) {
    const VB = this.davis.classes.VB;
    const nlp = exchange.getNlpData();
    const timeRange = "In the next half hour, ";

    if (app) {
      const alias = new VB.Alias(app);
      text = [timeRange, alias, 'will likely not experience any user actions'];
      return {
        say: VB.audible(text),
        show: VB.slackify(text),
        text: VB.stringify(text),
      };
    }

    const text = [timeRange, 'none of your apps are expected to experience any user actions'];
    return {
      say: VB.audible(text),
      show: VB.slackify(text),
      text: VB.stringify(text),
    };
  } 
}

module.exports = UserActivityPrediction;
