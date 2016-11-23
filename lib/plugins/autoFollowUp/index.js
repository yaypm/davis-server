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
        if (_.isBoolean(choice)) {
          if (!choice) {
            return this.davis.pluginManager.run(exchange, 'stop');
          }
          return exchange.response('What can I help you with?').skipFollowUp();
        }
        return this.davis.pluginManager.run(exchange, 'unknown');
      },
    };
  }
}

module.exports = AutoFollowUp;
