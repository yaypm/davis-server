'use strict';

const _ = require('lodash');

class LastProblem {
  constructor(davis, options) {
    this.davis = davis;
    this.options = options;

    this.intents = {
      lastProblem: {
        usage: 'Discover problems',
        phrases: [
          'tell me about the latest problem',
          'what was the most recent issue?',
          'what was the latest problem?',
        ],
        lifecycleEvents: [
          'lastProblem',
        ],
        clarification: 'I think you were asking about the most recent issue.',
      },
    };

    this.hooks = {
      'lastProblem:lastProblem': (exchange) => this.lastProblem(exchange),
    };
  }

  lastProblem(exchange) {
    exchange.addTemplateContext({ lastProblem: true });
    return this.davis.dynatrace.problemFeed({ relativeTime: 'day' })
      .then(resp => resp.result.problems)
      .then(problems => {
        if (problems.length === 0) {
          return exchange
          .response('No recent problems discovered')
          .smartEnd();
        }

        const top = _.maxBy(problems, p => p.startTime);

        exchange
          .addContext({
            problems: [top],
            choice: true,
            mostRecent: true,
          });

        return this.davis.pluginManager.run(exchange, 'problemDetails');
      });
  }
}

module.exports = LastProblem;
