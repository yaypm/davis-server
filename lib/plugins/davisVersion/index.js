'use strict';

const BbPromise = require('bluebird');

class DavisVersion {
  constructor(davis, options) {
    this.davis = davis;
    this.options = options;

    this.intents = {
      davisVersion: {
        usage: 'Davis version',
        phrases: [
          'what version are you?',
          'what version of davis is running?',
        ],
        lifecycleEvents: [
          'davisVersion',
        ],
        regex: /(what|which) version/,
      },
    };

    this.hooks = {
      'davisVersion:davisVersion': exchange => BbPromise.resolve(exchange).bind(this)
        .then(this.davisVersion),
    };
  }

  davisVersion(exchange) {
    const version = this.davis.version;

    exchange.addContext({ version });

    const templates = this.davis.pluginManager.responseBuilder.getTemplates(this);

    exchange
      .greet()
      .response(templates)
      .smartEnd();
  }
}

module.exports = DavisVersion;
