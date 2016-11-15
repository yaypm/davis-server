'use strict';

const BbPromise = require('bluebird');
const _ = require('lodash');

class Unknown {
  constructor(davis, options) {
    this.davis = davis;
    this.options = options;

    this.intents = {
      unknown: {
        usage: 'Default intent if no others are matched',
        phrases: [],
        lifecycleEvents: [
          'unknown',
        ],
      },
    };

    this.hooks = {
      'unknown:unknown': (exchange) => BbPromise.resolve(exchange).bind(this)
        .then(this.unknown),
    };
  }

  unknown(exchange) {
    const previousIntent = _.get(exchange, 'history.lastInteraction.request.analysed.intent');

    if (previousIntent === 'unknown') {
      exchange
        .addContext({ targetIntent: 'help' })
        .response("Unfortunately, I'm still a bit confused.")
        .followUp('Would you be interested in hearing about my current area of expertise?');
    } else {
      exchange
        .response("I'm still learning!")
        .skipFollowUp();
    }
  }
}

module.exports = Unknown;
