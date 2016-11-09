'use strict';

class DateDebug {
  constructor(davis, options) {
    this.davis = davis;
    this.options = options;
    this.dir = __dirname;

    this.intents = {
      dateDebug: {
        usage: 'Debug the datetime parser',
        phrases: [
          'Debug the datetime parser {{DATETIME}}',
        ],
        lifecycleEvents: [
          'dateDebug',
        ],
      },
    };

    this.hooks = {
      'dateDebug:dateDebug': this.debug,
    };
  }

  debug(exchange) {
    const timeRange = exchange.getTimeRange();
    exchange
      .response(`${timeRange.startTime.format()} - ${timeRange.stopTime.format()}`)
      .skipFollowUp();
  }
}

module.exports = DateDebug;
