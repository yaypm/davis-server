'use strict';

const BbPromise = require('bluebird');

class Scalability {
  constructor(davis, options) {
    this.davis = davis;
    this.options = options;

    this.intents = {
      scalability: {
        usage: 'Ask about current server capacity issues',
        phrases: [
          'Are there any capacity issues?',
          'how is my application scaling?',
        ],
        lifecycleEvents: [
          'scalability',
        ],
      },
    };

    this.hooks = {
      'scalability:scalability': (exchange) => BbPromise.resolve(exchange).bind(this)
        .then(this.scalability),
    };
  }

  scalability(exchange) {
    this.davis.logger.debug(exchange);
  }
}

module.exports = Scalability;
