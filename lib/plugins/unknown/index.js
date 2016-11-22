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
      const excuse = _.sample([
        "I'm sorry but I didn't quite understand what you were asking.",
        'I know a lot, about a little!  Please, go easy on me.',
        "I don't know how to respond to this... yet!",
        "hmmm, I'm not sure how to respond to that.",
        "sorry, I didn't understand the question.",
        "My apologies but I don't know how to help with that at the moment.",
        "sorry, I can't help with that yet.",
        "sorry, I'm not sure how to help.",
      ]);

      exchange
        .response(excuse)
        .skipFollowUp();
    }
  }
}

module.exports = Unknown;
