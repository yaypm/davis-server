'use strict';

const BbPromise = require('bluebird');

class DavisVersion {
  constructor(davis, options) {
    this.davis = davis;
    this.options = options;

    this.intents = {
      davisVersion: {
        usage: 'DAVIS version',
        phrases: [
          'what version are you?',
          'what version of davis is running?',
        ],
        lifecycleEvents: [
          'davisVersion',
        ],
      },
    };

    this.hooks = {
      'davisVersion:davisVersion': (exchange) => BbPromise.resolve(exchange).bind(this)
        .then(this.davisVersion),
    };
  }

  davisVersion(exchange) {
    this.davis.logger.debug(exchange);
  }
}

module.exports = DavisVersion;
