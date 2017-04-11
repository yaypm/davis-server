'use strict';

const _ = require('lodash');
const BbPromise = require('bluebird');

class UserActivity {
  constructor(davis, options) {
    this.davis = davis;
    this.options = options;

    this.intents = {
      userActivity: {
        usage: 'Ask about current activity levels',
        examples: [
          'Tell me about user activity.',
          'What is the current user activity for my application?',
          'What were user activity levels like yesterday?',
        ],
        phrases: [
          'tell me about user activity',
          'tell me about user activity {{DATETIME}}',
          'update me on user activity',
          'can you tell me about user activity levels {{DATETIME}}?',
          'tell me about use activity on {{APP}} {{DATETIME}}',
          'give me an update on user activity',
          'use activity {{APP}} {{DATETIME}}',
          'user activity {{APP}} {{DATETIME}}',
          'what is the current user activity',
        ],
        lifecycleEvents: [
          'userActivity',
        ],
        clarification: 'I think you were asking about user activity.',
      },
    };

    this.hooks = {
      'userActivity:userActivity': (exchange) => {
        const nlp = exchange.getNlpData();

        const params = {
          timeseriesId: 'com.dynatrace.builtin:app.useractionsperminute',
          queryMode: 'series',
          aggregationType: 'count',
          entity: _.get(nlp, 'app.app.entityId'),
        };
        
        const paramsPredict = {
          timeseriesId: 'com.dynatrace.builtin:app.useractionsperminute',
          relativeTime: '30mins',
          queryMode: 'series',
          aggregationType: 'count',
          entity: _.get(nlp, 'app.app.entityId'),
          predict: 'true',
        };
        
        return BbPromise.all([this.davis.dynatrace.getFilteredTimeseriesData(exchange, params), this.davis.dynatrace.getFilteredTimeseriesData(exchange, paramsPredict)])
          .spread((result, resultPredict) => {
            
            const entities = Object.keys(result.entities);
            const numApps = entities.length;
            const appName = _.get(nlp, 'app.name') || (numApps === 1) ? result.entities[entities[0]] : null;
            if (appName) {
              const entity = _.find(this.davis.pluginManager.entities.applications, { name: appName });
              return this.appResponse(exchange, result, resultPredict, entity);
            }
            return this.noAppResponse(exchange, result, resultPredict);
          });
      },
    };
  }

  appResponse(exchange, data, dataPredict, app) {
    const VB = this.davis.classes.VB;
    const th = this.davis.textHelpers;
    const stats = data.stats[app.entityId];

    const nlp = exchange.getNlpData();


    if (data.stats.maxMean.value === 0) {
      return this.noActivity(exchange, app);
    }
    
    const pointPredict = dataPredict.dataPoints[app.entityId];
    const averagePredict = Math.ceil(pointPredict[pointPredict.length - 1][1]);

    const timeRange = new VB.TimeRange(nlp.timeRange, exchange.user.timezone);
    const alias = new VB.Alias(app);
    const mints = new VB.TimeStamp(stats.minTime, exchange.user.timezone);
    const maxts = new VB.TimeStamp(stats.maxTime, exchange.user.timezone);

    const text = [timeRange, alias, 'experienced an average load of',
      stats.average, 'user actions', 'per minute. The greatest load was',
      stats.max, 'user actions per', 'minute', maxts, '.',
      'The least active time was', mints, 'when', stats.min,
      'user actions occurred.', 'In the next half hour,',
      'expect around', averagePredict,
      'user actions per minute.'];

    const out = {
      say: VB.audible(text),
      show: VB.stringify(text),
      text: VB.slackify(text),
    };

    return exchange
      .setLinkUrl(this.davis.linker.userActivity(app.entityId, exchange.getTimeRange()))
      .response(out);
  }

  noAppResponse(exchange, data, dataPredict) {
    const VB = this.davis.classes.VB;
    const th = this.davis.textHelpers;
    const nlp = exchange.getNlpData();
    this.davis.logger.debug('No app found, searching for application with highest activity.');
    if (data.stats.maxMean.value === 0) {
      return this.noActivity(exchange);
    }

    const entities = data.entities;
    const bigApp = _.get(data, 'stats.maxMean.entity');

    if (_.isNil(bigApp)) {
      return exchange.response('No user activity data found.').skipFollowUp();
    }
    
    const pointPredict = dataPredict.dataPoints[bigApp];
    const averagePredict = Math.ceil(pointPredict[pointPredict.length - 1][1]);

    const stats = data.stats[bigApp];

    const app = _.find(this.davis.pluginManager.entities.applications, { entityId: bigApp });

    const timeRange = new VB.TimeRange(nlp.timeRange, exchange.user.timezone);
    const alias = app ? new VB.Alias(app) : entities[bigApp];
    const mints = new VB.TimeStamp(stats.minTime, exchange.user.timezone);
    const maxts = new VB.TimeStamp(stats.maxTime, exchange.user.timezone);

    const text = [timeRange, alias, 'was your most active application,',
      'experiencing an average load of', stats.average, 'user actions',
      'per minute. The greatest load was', stats.max, 'user actions per',
      'minute', maxts, '.', 'The least active time was', mints, 'when',
      stats.min, 'user actions occurred.', 'In the next half hour,',
      'expect around', averagePredict,
      'user actions per minute.'];

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
    const timeRange = new VB.TimeRange(nlp.timeRange, exchange.user.timezone);

    if (app) {
      const alias = new VB.Alias(app);
      text = [timeRange, alias, 'did not experience any user actions'];
      return {
        say: VB.audible(text),
        show: VB.slackify(text),
        text: VB.stringify(text),
      };
    }

    const text = [timeRange, 'none of your apps experienced any user actions'];
    return {
      say: VB.audible(text),
      show: VB.slackify(text),
      text: VB.stringify(text),
    };
  }
}

module.exports = UserActivity;
