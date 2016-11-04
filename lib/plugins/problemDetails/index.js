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
    const choice = context.choice;
    let idx = -1;

    if (context.targetIntent === 'problemDetails') {
      if (_.isNumber(choice) & choice <= 2) {
        idx = choice;
      } else if (_.isBoolean(choice)) {
        if (!choice) {
          exchange.response('Ok').end();
          return;
        }
      } else if (_.isString(choice)) {
        if (choice === 'middle') {
          idx = (context.problems.length / 2).toFixed();
        } else if (choice === 'last') {
          idx = context.problems.length - 1;
        }
      }
    }

    if (idx !== -1) {
      exchange.response(`You asked about problem id: ${context.problems[idx]}`);
    }
  }
}

module.exports = ProblemDetails;
