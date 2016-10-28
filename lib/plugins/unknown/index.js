'use strict';

const BbPromise = require('bluebird');

class Unknown {
  constructor(davis, options) {
    this.davis = davis;
    this.options = options;

    this.intents = {
      unknown: {
        usage: 'Default intent if no others are matched',
        phrases: [

        ],
        lifecycleEvents: [
          'unknown',
        ],
      },
    };

    this.hooks = {
      'unknown:unknown': (exchange) => BbPromise.resolve(exchange).bind(this)
        .then(this.unknown),
    };
  }

  unknown(exchange) {
    this.davis.logger.debug(exchange);
  }
}

module.exports = Unknown;