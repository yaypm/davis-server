'use strict';

const _ = require('lodash');

class AutoFollowUp {
  constructor(davis, options) {
    this.davis = davis;
    this.options = options;

    this.intents = {
      autoFollowUp: {
        usage: 'Handle automatic follow up questions',
        phrases: [
        ],
        lifecycleEvents: [
          'autoFollowUp',
        ],
      },
    };

    this.hooks = {
      'autoFollowUp:autoFollowUp': (exchange, context) => {
        const choice = context.choice;
        const oldTarget = context.previousTarget || 'unknown';
        if (_.isBoolean(choice)) {
          if (!choice) {
            return this.davis.pluginManager.run(exchange, 'stop');
          }
          return exchange.response('What can I help you with?').skipFollowUp();
        }
        if (oldTarget === 'autoFollowUp') {
          exchange.resetContext();
          return exchange.response("I'm sorry, but I'm not sure how to handle that answer.");
        }
        exchange.addContext({ targetIntent: oldTarget });
        return this.davis.pluginManager.run(exchange, oldTarget);
      },
    };
  }
}

module.exports = AutoFollowUp;
