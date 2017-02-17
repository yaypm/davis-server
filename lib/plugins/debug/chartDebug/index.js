'use strict';

const timeseriesData = require('./data.json');
const BbPromise = require('bluebird');
const rp = require('request-promise');

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

  ask(exchange, context) {
    const start = new Date();
    return this.davis.charts.createTimeseries('APPLICATION-157F59F44773DD97', timeseriesData)
      .then((image) => {
        const team = context.scope.split(':')[1];
        const channel = context.scope.split(':')[2];
        const bot = this.davis.sources.slack.bots[team];
        const upload = BbPromise.promisify(bot.api.files.upload);

        const content = image;
        const filename = 'chart.png';
        const title = 'Davis Charts';

        const options = {
          method: 'POST',
          uri: 'https://slack.com/api/files.upload',
          formData: {
            channels: channel,
            token: bot.config.token,
            file: {
              value: image,
              options: {
                filename,
                contentType: 'image/png',
                knownLength: image.length,
              },
            },
          },
          json: true,
        };
        return rp(options)
      })
      .then((res) => {
        const team = context.scope.split(':')[1];
        const bot = this.davis.sources.slack.bots[team];
        const options = {
          uri: 'https://slack.com/api/files.sharedPublicURL',
          json: true,
          method: 'POST',
          body: {
            file: res.file.id,
            token: bot.config.token,
          },
        };
        return rp(options);
      })
      .then((res) => {
        const stop = new Date();
        exchange.response(`${stop - start}`);
      });
  }
}

module.exports = ChartDebug;
