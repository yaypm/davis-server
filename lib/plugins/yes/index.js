'use strict';

const BbPromise = require('bluebird');

class Yes {
  constructor(davis, options) {
    this.davis = davis;
    this.options = options;

    this.intents = {
      yes: {
        usage: 'Answer yes',
        phrases: [
          'absolutely',
          'go for it',
          'ok',
          'okay',
          'please',
          'yes please',
          'Yes.',
        ],
        lifecycleEvents: [
          'yes',
        ],
      },
    };

    this.hooks = {
      'yes:yes': (exchange) => BbPromise.resolve(exchange).bind(this)
        .then(this.yes),
    };
  }

  yes(exchange) {
    this.davis.logger.debug(exchange);
  }
}

module.exports = Yes;
