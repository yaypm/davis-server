'use strict';

const BbPromise = require('bluebird');

class No {
  constructor(davis, options) {
    this.davis = davis;
    this.options = options;

    this.intents = {
      no: {
        usage: 'Answer no',
        phrases: [
          'absolutely not',
          'naw',
          'No thanks.',
          'no',
          'No.',
          'nope',
        ],
        lifecycleEvents: [
          'no',
        ],
      },
    };

    this.hooks = {
      'no:no': (exchange) => BbPromise.resolve(exchange).bind(this)
        .then(this.no),
    };
  }

  no(exchange) {
    this.davis.logger.debug(exchange);
  }
}

module.exports = No;
