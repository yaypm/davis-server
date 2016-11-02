'use strict';

const BbPromise = require('bluebird');
const _ = require('lodash');

class ProblemDetails {
  constructor(davis, options) {
    this.davis = davis;
    this.options = options;

    this.intents = {
      problemDetails: {
        usage: 'Problem details',
        phrases: [

        ],
        lifecycleEvents: [
          'problemDetails',
        ],
      },
    };

    this.hooks = {
      'after:routing:choice': (exchange) => BbPromise.resolve(exchange).bind(this)
        .then(this.problemDetails),
    };
  }

  problemDetails(exchange) {
    const context = exchange.getConversationContext();

    if (context.targetIntent === 'problemDetails') {
      if (!_.isNumber(context.choice) || context.choice > 2) {
        exchange.response('You have to pick one of the three').end();
      } else {
        exchange.response(`You asked about problem id: ${context.problems[context.choice]}`);
      }
    }
  }
}

module.exports = ProblemDetails;
