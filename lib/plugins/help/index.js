'use strict';

const BbPromise = require('bluebird');

class Help {
  constructor(davis, options) {
    this.davis = davis;
    this.options = options;

    this.intents = {
      help: {
        usage: 'Ask for help',
        phrases: [
          'help me please',
          'help me',
          'I could use a little help',
          'I need help',
          'what does the key represent?',
          "what's :key:",
        ],
        lifecycleEvents: [
          'help',
        ],
      },
    };

    this.hooks = {
      'help:help': (exchange) => BbPromise.resolve(exchange).bind(this)
        .then(this.help),
    };
  }

  help(exchange) {
    this.davis.logger.debug(exchange);
  }
}

module.exports = Help;
