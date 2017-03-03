'use strict';

const _ = require('lodash');

class ChartDebug {
  constructor(davis, options) {
    this.davis = davis;
    this.options = options;
    this.dir = __dirname;

    this.intents = {
      startChartDebug: {
        usage: 'Debug the chart intent',
        phrases: [
          'charts',
          'charts {{DATETIME}}',
          'charts {{APP}} {{DATETIME}}',
        ],
        lifecycleEvents: [
          'ask',
        ],
        //regex: /^chart$/,
      },
    };

    this.hooks = {
      'startChartDebug:ask': this.ask.bind(this),
    };
  }

  ask(exchange) {
    const VB = this.davis.classes.VB;

    const nlp = exchange.getNlpData();
    const params = {
      timeseriesId: 'com.dynatrace.builtin:app.useractionsperminute',
      queryMode: 'series',
      aggregationType: 'count',
      entity: _.get(nlp, 'app.app.entityId'),
    };

    return this.davis.dynatrace.getFilteredTimeseriesData(exchange, params)
      .then(data => this.davis.charts.save(data, 'APPLICATION-7324C7EE41CC3273'))
      .then((url) => {
        const card = new VB.Card()
          .addText('Check out this sweet chart!')
          .addFallback('yo')
          .setImageURL(url);

        const msg = new VB.Message()
          .addCard(card);

        return exchange.response({ show: msg }).end();
      });
  }
}

module.exports = ChartDebug;
