'use strict';

const BbPromise = require('bluebird');

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
  }

  problem(exchange) {
  }
}

module.exports = Problem;
