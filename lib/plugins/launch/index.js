'use strict';

const BbPromise = require('bluebird');
const _ = require('lodash');

class Launch {
  constructor(davis, options) {
    this.davis = davis;
    this.options = options;

    this.intents = {
      launch: {
        usage: 'Launch Davis',
        phrases: [
          'davis',
          'hey davis',
          'hi davis',
          'launch',
          "let's get started",
          'Start davis',
          'start davis',
          'start',
        ],
        lifecycleEvents: [
          'launch',
        ],
        regex: /^(hey|hi|launch|start|ask)( davis)?$/i,
      },
    };

    this.hooks = {
      'launch:launch': exchange => BbPromise.resolve(exchange).bind(this)
        .then(this.launch),
    };
  }

  launch(exchange) {
    const response = _.sample([
      "What's up?",
      'How can I be of service?',
      'How can I help you?',
    ]);

    exchange.response(response).skipFollowUp();
  }
}

module.exports = Launch;
