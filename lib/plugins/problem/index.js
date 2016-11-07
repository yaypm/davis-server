'use strict';

const BbPromise = require('bluebird');
const _ = require('lodash');

class Problem {
  constructor(davis, options) {
    this.davis = davis;
    this.options = options;

    this.intents = {
      problem: {
        usage: 'Discover problems',
        phrases: [
          "How's {{APP}} doing?",
          'any issues',
          'Are there any issues at the moment?',
          'Are there any on going issues?',
          'Did anything happen to {{APP}} {{DATETIME}}?',
          'Did anything happen to {{APP}}?',
          'Did anything happen with {{APP}} {{DATETIME}}?',
          'Did anything happen {{DATETIME}}',
          'Did anything happen',
          'Did anything happend to {{APP}} {{DATETIME}}?',
          'did anything happened {{DATETIME}}?',
          'what happened with {{APP}} {{DATETIME}}',
          'What happened {{DATETIME}} with {{APP}}?',
          'What happened {{DATETIME}}?',
        ],
        lifecycleEvents: [
          'gatherData',
          'problem',
        ],
      },
    };

    this.hooks = {
      'problem:gatherData': (exchange) => BbPromise.resolve(exchange).bind(this)
        .then(this.gatherData),
      'problem:problem': (exchange) => BbPromise.resolve(exchange).bind(this)
        .then(this.problem),
    };
  }

  gatherData(exchange) {
    const context = {
      targetIntent: 'problemDetails',
      problems: ['001', '002', '003'],
    };

    exchange
      .addConversationContext(context);
  }

  problem(exchange) {
    const context = exchange.getConversationContext();
    exchange
      .response(`There were 3 problems: ${context.problems}.`)
      .followUp('Which would you like to hear about?');
  }
}

module.exports = Problem;
