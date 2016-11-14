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
          'for some help',
          'to help me',
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
    exchange
      .greet()
      .response('I\'ll be able to help you in the future!')
      .smartEnd();
  }
}

module.exports = Help;
