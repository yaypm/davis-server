'use strict';

const _ = require('lodash');

class RoutingDebug {
  constructor(davis, options) {
    this.davis = davis;
    this.options = options;

    this.intents = {
      routingDebug: {
        usage: 'Debug the routing intent',
        phrases: [
          'Debug the routing intent',
        ],
        lifecycleEvents: [
          'ask',
        ],
      },
    };

    this.hooks = {
      'routingDebug:ask': this.ask,
      'after:routing:choice': this.debug,
    };
  }

  ask(exchange) {
    exchange
      .setConversationContextProperty('targetIntent', 'routingDebug')
      .response('Debugging routing.').skipFollowUp();
  }

  debug(exchange, context) {
    const choice = _.isNumber(context.choice) ? context.choice + 1 : context.choice;
    if (context.targetIntent === 'routingDebug') {
      exchange.response(`You answered: ${choice}.`).skipFollowUp();
    }
  }
}

module.exports = RoutingDebug;
