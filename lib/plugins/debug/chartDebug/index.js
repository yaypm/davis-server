'use strict';

const timeseriesData = require('./data.json');

class ChartDebug {
  constructor(davis, options) {
    this.davis = davis;
    this.options = options;
    this.dir = __dirname;

    this.intents = {
      startChartDebug: {
        usage: 'Debug the chart intent',
        phrases: [],
        lifecycleEvents: [
          'ask',
        ],
        regex: /^chart$/,
      },
    };

    this.hooks = {
      'startChartDebug:ask': this.ask.bind(this),
    };
  }

  ask(exchange) {
    return this.davis.charts.createTimeseries('APPLICATION-157F59F44773DD97', timeseriesData)
      .then(image => console.log(image.length))
      .then(() => {
        exchange.response('done!');
      });
  }
}

module.exports = ChartDebug;
