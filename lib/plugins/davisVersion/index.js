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
    this.davis.logger.debug('Responding from the Davis version plugin.');

    const version = this.davis.version;

    exchange.addContext({ version });

    // const text = `I am currently running Davis Server version ${version}`;
    // const response = { say: text, show: { text  } };

    // exchange.greet().response(
    //   {
    //     textString: `You're currently running version {{version}} of Davis!`
    //   });

    const templates = this.davis.pluginManager.responseBuilder.getTemplates(this);

    exchange.greet().response(templates);
  }
}

module.exports = DavisVersion;
