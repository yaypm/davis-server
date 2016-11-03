'use strict';

const BbPromise = require('bluebird');
const _ = require('lodash');

class Ping {
  constructor(davis, options) {
    this.davis = davis;
    this.options = options;

    this.intents = {
      ping: {
        usage: 'Responses to a ping request',
        phrases: [
          'ping',
        ],
        lifecycleEvents: [
          'ping',
        ],
      },
    };

    this.hooks = {
      'ping:ping': (exchange) => BbPromise.resolve(exchange).bind(this)
        .then(this.ping),
    };
  }

  ping(exchange) {
    const response = _.sample([
      'pong.',
    ]);

    exchange.response(response).smartEnd();
  }
}

module.exports = Ping;
