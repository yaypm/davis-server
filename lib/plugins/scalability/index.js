'use strict';

const moment = require('moment-timezone');
const _ = require('lodash');
const model = require('./model');

class Scalability {
  constructor(davis, options) {
    this.davis = davis;
    this.options = options;

    this.intents = {
      scalability: {
        usage: 'Ask about current server capacity issues',
        phrases: [
          'Are there any capacity issues?',
          'How is my application scaling?',
          'How\'s my application scaling?',
          'How\'s my app scaling?',
        ],
        lifecycleEvents: [
          'gatherData',
          'decide',
          'scalability',
        ],
      },
    };

    this.hooks = {
      'scalability:gatherData': (exchange) => this.gatherData(exchange),
      'scalability:decide': (exchange, context) => this.decide(exchange, context),
      'scalability:scalability': (exchange, context) => this.scalability(exchange, context),
    };
  }

  gatherData(exchange) {
    // Set timeRange to past week
    _.set(exchange, 'model.request.analysed.timeRange.startTime', moment().subtract(1, 'weeks'));
    _.set(exchange, 'model.request.analysed.timeRange.stopTime', moment());

    return this.davis.dynatrace.getFilteredProblems(exchange)
      .then(problems => {
        const context = {
          problems: problems.toArray(),
        };

        exchange.addContext(context);
      });
  }

  decide(exchange, context) {
    const problems = (context.problems.length < 3) ? context.problems.length : 3;

    const out = exchange.decide.predict(model, { problems });

    if (out.followUp) {
      exchange.followUp(out.question);
    } else {
      exchange.skipFollowUp();
    }

    exchange.addContext({
      templateDir: out.template,
    });
  }

  scalability(exchange, context) {
    const templates = this.davis.pluginManager.responseBuilder
      .getTemplates(this, context.templateDir);

    if (Object.keys(templates).length === 0) {
      throw new this.davis.classes.Error(`Cannot find a template at ${context.templateDir}.`);
    }

    exchange
      .addContext({
        targetIntent: 'problemDetails',
      })
      .response(templates);
  }
}

module.exports = Scalability;
