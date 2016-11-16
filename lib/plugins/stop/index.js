'use strict';

const BbPromise = require('bluebird');
const _ = require('lodash');
const phrases = require('./phrases');

class Stop {
  constructor(davis, options) {
    this.davis = davis;
    this.options = options;

    this.intents = {
      stop: {
        usage: 'Ends the current conversation with Davis.',
        phrases,
        lifecycleEvents: [
          'stop',
        ],
        regex: /^stop$/i,
      },
    };

    this.hooks = {
      'stop:stop': (exchange) => BbPromise.resolve(exchange).bind(this)
        .then(this.stop),
    };
  }

  stop(exchange) {
    this.davis.logger.debug('Ending the current conversation.');
    const response = _.sample([
      'Okay, have a good one.',
      'Talk to you later.',
      'Bye!',
      'See you later.',
    ]);
    exchange.response(response).end();
  }
}

module.exports = Stop;
