'use strict';

const _ = require('lodash');
const Problems = require('../../classes/Dynatrace/Problems');

class TopRootCauses {
  constructor(davis, options) {
    this.davis = davis;
    this.options = options;

    this.intents = {
      topRootCauses: {
        title: 'Discover the top root causes in a time range',
        usage: 'Ask about current or historical time ranges',
        examples: [
          'What were the top root causes in the last 24 hours?',
          'What are the top root causes affecting application_name',
        ],
        phrases: [
          'What were the top root causes {{DATETIME}}',
          'What are the top root causes affecting {{APP}}',
          'What are the top root causes affecting {{APP}} {{DATETIME}}',
        ],
        lifecycleEvents: [
          'gatherData',
        ],
        clarification: 'I think you were asking about root causes.',
      },
    };

    this.hooks = {
      'topRootCauses:gatherData': this.gatherData.bind(this),
    };
  }

  gatherData(exchange) {
    const th = this.davis.textHelpers;
    const tense = this.davis.utils.getTense(exchange);

    exchange
      .setTarget('eventDetails');

    if (!exchange.explicitTimeRange()) {
      exchange.forceTimeRange('1w');
    }
    console.log(exchange.getTimeRange());

    return this.davis.dynatrace.getFilteredProblems(exchange)
      .then((ret) => {
        const problems = ret.toArray();
        const roots = problems.filter(p => p.hasRootCause);
        const impacts = roots.map(root => root.rankedImpacts);
        exchange.response('root cause');
      });
  }

}

module.exports = TopRootCauses;

