'use strict';

const BbPromise = require('bluebird');

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
      'problemDetails:problemDetails': (exchange) => BbPromise.resolve(exchange).bind(this)
        .then(this.problemDetails),
    };
  }

  problemDetails(exchange) {
    this.davis.logger.debug(exchange);
  }
}

module.exports = ProblemDetails;
