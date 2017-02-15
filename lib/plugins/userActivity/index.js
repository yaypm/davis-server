'use strict';

const _ = require('lodash');

class UserActivity {
  constructor(davis, options) {
    this.davis = davis;
    this.options = options;

    this.intents = {
      userActivity: {
        usage: 'Ask about current activity levels',
        examples: [
          'Tell me about user activity.',
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
        const app = _.get(nlp, 'app.name');

        const params = {
          timeseriesId: 'com.dynatrace.builtin:app.useractionsperminute',
          queryMode: 'series',
          aggregationType: 'count',
          entity: _.get(nlp, 'app.app.entityId'),
        };

        return this.davis.dynatrace.getFilteredTimeseriesData(exchange, params)
          .then((result) => {
            if (app) {
              const entity = _.find(this.davis.pluginManager.entities.applications, { name: app });
              return this.appResponse(exchange, result, entity);
            }
            return this.noAppResponse(exchange, result);
          });
      },
    };
  }

  appResponse(exchange, data, app) {
    const name = app.name;
    const eId = app.entityId;

    const stats = data.stats[eId];
    stats.appName = name;
    stats.customTimeRange = !_.isUndefined(_.get(exchange, 'model.request.analysed.datetime'));

    exchange.addExchangeContext(stats);
    const templates = this.davis.pluginManager.responseBuilder.getTemplates(this);
    exchange.response(templates);
  }

  noAppResponse(exchange, data) {
    this.davis.logger.debug('No app found, searching for application with highest activity.');

    const entities = data.entities;
    const bigApp = _.get(data, 'stats.maxMean.entity');

    if (_.isNil(bigApp)) {
      return exchange.response('No user activity data found.').skipFollowUp();
    }

    const stats = data.stats[bigApp];

    const app = _.find(this.davis.pluginManager.entities.applications, { entityId: bigApp });

    stats.appName = _.get(app, 'name', entities[bigApp]);
    stats.customTimeRange = !_.isUndefined(_.get(exchange, 'model.request.analysed.datetime'));
    exchange.addExchangeContext(stats);
    const templates = this.davis.pluginManager.responseBuilder.getTemplates(this, 'noApp');
    return exchange.response(templates);
  }
}

module.exports = UserActivity;
