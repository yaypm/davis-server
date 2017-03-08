'use strict';

const _ = require('lodash');

class UserActivity {
  constructor(davis, options) {
    this.davis = davis;
    this.options = options;
    this.VB = this.davis.classes.VB;

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
    const message = new this.VB.Message();

    const name = app.name;
    const eId = app.entityId;
    const nlp = exchange.getNlpData();

    const stats = data.stats[eId];
    stats.appName = name;
    stats.customTimeRange = !_.isUndefined(_.get(exchange, 'model.request.analysed.datetime'));

    const range = (stats.customTimeRange) ?
      new this.VB.TimeRange(nlp.timeRange, exchange.user.timezone, true) :
      'The last 24 hours';

    // Why is this there?
    // console.log(range);

    exchange.addExchangeContext(stats);

    if (data.stats.maxMean.value === 0) {
      return this.noActivity(exchange, name);
    }

    const templates = this.davis.pluginManager.responseBuilder.getTemplates(this);

    return this.appShow(exchange, data, eId)
      .then((card) => {
        templates.show = message.addCard(card).slack();
        return exchange.response(templates);
      });
  }

  noAppResponse(exchange, data) {
    this.davis.logger.debug('No app found, searching for application with highest activity.');
    if (data.stats.maxMean.value === 0) {
      return this.noActivity(exchange);
    }

    const bigApp = _.get(data, 'stats.maxMean.entity');

    if (_.isNil(bigApp)) {
      return exchange.response('No user activity data found.').skipFollowUp();
    }

    const stats = data.stats[bigApp];


    stats.appName = data.entities[bigApp]; // _.get(app, 'name', entities[bigApp]);
    stats.customTimeRange = !_.isUndefined(_.get(exchange, 'model.request.analysed.datetime'));
    exchange.addExchangeContext(stats);
    const templates = this.davis.pluginManager.responseBuilder.getTemplates(this, 'noApp');

    const nlp = exchange.getNlpData();
    const range = new this.VB.TimeRange(nlp.timeRange, exchange.user.timezone);
    return this.appShow(exchange, data, bigApp)
      .then((show) => {
        show[0].addText(['I have determined that this was your most active application', range, '.']);
        templates.show = new this.VB.Message().addCard(show).slack();
        exchange.response(templates);
      });
  }

  noActivity(exchange, name) {
    exchange.addExchangeContext({ appName: name });
    const templates = (name) ?
      this.davis.pluginManager.responseBuilder.getTemplates(this, 'noAppActivity') :
      this.davis.pluginManager.responseBuilder.getTemplates(this, 'noActivity');
    return exchange.response(templates);
  }

  appShow(exchange, data, eid) {
    const imgCard = new this.VB.Card();
    const statsCard = new this.VB.Card();

    const nlp = exchange.getNlpData();
    const name = data.entities[eid];
    const stats = data.stats[eid];
    const maxTime = new this.VB.TimeStamp(stats.maxTime, exchange.user.timezone);
    const minTime = new this.VB.TimeStamp(stats.minTime, exchange.user.timezone);

    const range = new this.VB.TimeRange(nlp.timeRange, exchange.user.timezone, true);

    return this.davis.charts.save(exchange, data, eid)
      .then((url) => {
        imgCard.addTitle(['User Activity for', name]);

        if (url) {
          imgCard.setImageURL(url);
        }

        statsCard
          .addField('Average Activity', [stats.average, 'User Actions / Minute'], true)
          .addField('Time Range', range, true)
          .addField('Maximum Activity', [stats.max, 'User Actions / Minute', '\n', maxTime], true)
          .addField('Minimum Activity', [stats.min, 'User Actions / Minute', '\n', minTime], true);

        return [imgCard, statsCard];
      });
  }
}

module.exports = UserActivity;
