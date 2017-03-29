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
    const th = this.davis.textHelpers;
    const name = app.name;
    const eId = app.entityId;

    const stats = data.stats[eId];
    stats.appName = name;
    stats.customTimeRange = !_.isUndefined(_.get(exchange, 'model.request.analysed.datetime'));

    exchange
      .setLinkUrl(th.buildUserActivityUrl(eId, exchange.getTimeRange()))
      .addExchangeContext(stats);

    if (data.stats.maxMean.value === 0) {
      return this.noActivity(exchange, name);
    }

    const templates = this.davis.pluginManager.responseBuilder.getTemplates(this);
    return exchange.response(templates);
  }

  noAppResponse(exchange, data) {
    const th = this.davis.textHelpers;
    this.davis.logger.debug('No app found, searching for application with highest activity.');
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

    stats.appName = _.get(app, 'name', entities[bigApp]);
    stats.customTimeRange = !_.isUndefined(_.get(exchange, 'model.request.analysed.datetime'));
    exchange
      .setLinkUrl(th.buildUserActivityUrl(bigApp, exchange.getTimeRange()))
      .addExchangeContext(stats);
    const templates = this.davis.pluginManager.responseBuilder.getTemplates(this, 'noApp');
    return exchange.response(templates);
  }

  noActivity(exchange, name) {
    exchange.addExchangeContext({ appName: name });
    const templates = (name) ?
      this.davis.pluginManager.responseBuilder.getTemplates(this, 'noAppActivity') :
      this.davis.pluginManager.responseBuilder.getTemplates(this, 'noActivity');
    return exchange.response(templates);
  }
}

module.exports = UserActivity;
