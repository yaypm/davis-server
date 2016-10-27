'use strict';

const BbPromise = require('bluebird');
const path = require('path');

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
    this.davis.logger.debug('Responding from the Davis version plugin.');

    const version = this.davis.version;

    // exchange.addContext({ version });

    // const templateDir = path.join(__dirname, 'templates', 'en-us');
    // const templates = this.davis.responseBuilder.getTemplates(templateDir);
    // const response = this.da/vis.responseBuilder.build(exchange, templateDir);

    // const text = `I am currently running Davis Server version ${version}`;
    // const response = { say: text, show: { text  } };
    exchange.greet().response(`You're currently running version ${version} of Davis!`);
  }
}

module.exports = DavisVersion;
