'use strict';

const _ = require('lodash');

class Thanks {
  constructor(davis, options) {
    this.davis = davis;
    this.options = options;

    this.intents = {
      thanks: {
        skipHelp: true,
        usage: 'Ends the current conversation with Davis.',
        phrases: ['thanks'],
        lifecycleEvents: [
          'thanks',
        ],
        regex: /^thanks?( you)?$/i,
      },
    };

    this.hooks = {
      'thanks:thanks': this.thanks.bind(this),
    };
  }

  thanks(exchange) {
    this.davis.logger.debug('Ending the current conversation.');
    const response = _.sample([
      "You're quite welcome.",
      "You're welcome",
      'Any time!',
    ]);
    exchange.response(response).end();
  }
}

module.exports = Thanks;
