'use strict';

const BbPromise = require('bluebird');

class Launch {
  constructor(davis, options) {
    this.davis = davis;
    this.options = options;

    this.intents = {
      launch: {
        usage: 'Launch DAVIS',
        phrases: [
          'davis',
          'hey davis',
          'hi davis',
          'launch',
          "let's get started",
          'Start davis',
          'start davis',
          'start',
        ],
        lifecycleEvents: [
          'launch',
        ],
      },
    };

    this.hooks = {
      'launch:launch': (exchange) => BbPromise.resolve(exchange).bind(this)
        .then(this.launch),
    };
  }

  launch(exchange) {
    this.davis.logger.debug(exchange);
  }
}

module.exports = Launch;
