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
      'davisVersion:davisVersion': exchange => BbPromise.resolve(exchange).bind(this)
        .then(this.davisVersion),
    };
  }

  davisVersion(exchange) {
    const version = this.davis.version;
    const req = exchange.getRawRequest();
    let templates;

    exchange.addTemplateContext({ version });

    if (req.indexOf('!') !== -1) {
      templates = this.davis.pluginManager.responseBuilder.getTemplates(this, 'excited');
    } else {
      templates = this.davis.pluginManager.responseBuilder.getTemplates(this);
    }

    exchange.greet().response(templates);
  }
}

module.exports = DavisVersion;
