'use strict';

const timeseriesData = require('./data.json');
const BbPromise = require('bluebird');
const rp = require('request-promise');
const _ = require('lodash');

class ChartDebug {
  constructor(davis, options) {
    this.davis = davis;
    this.options = options;
    this.dir = __dirname;

    this.intents = {
      startChartDebug: {
        usage: 'Debug the chart intent',
        phrases: ['charts'],
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

  ask(exchange, context) {
    const VB = this.davis.classes.VB;

    const nlp = exchange.getNlpData();
    const params = {
      timeseriesId: 'com.dynatrace.builtin:app.useractionsperminute',
      queryMode: 'series',
      aggregationType: 'count',
      entity: _.get(nlp, 'app.app.entityId'),
    };

    return this.davis.dynatrace.getFilteredTimeseriesData(exchange, params)
      .then(data => this.davis.charts.save(data))
      .then(uid => {
        console.log(`This is the UID ${uid}`);
        const card = new VB.Card()
          .addFallback('yo')
          .setImageURL(`http://localhost:3000/charts/${uid}.png`);

        const msg = new VB.Message()
          .addText('Check out this sweet chart!')
          .addCard(card);

        return exchange.response({ show: msg }).end();
      });
  }
}

module.exports = ChartDebug;
