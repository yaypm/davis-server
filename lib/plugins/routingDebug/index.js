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
    const context = {
      targetIntent: 'routingDebug',
      problems: ['001', '002', '003'],
    };
    exchange
      .addConversationContext(context)
      .response('Debugging routing.').skipFollowUp();
  }

  debug(exchange) {
    const context = exchange.getConversationContext();
    const choice = _.isNumber(context.choice) ? context.choice + 1 : context.choice;
    if (context.targetIntent === 'routingDebug') {
      exchange.response(`You answered: ${choice}.`).skipFollowUp();
    }
  }
}

module.exports = RoutingDebug;
