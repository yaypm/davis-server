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
          'Are there any capacity issues {{DATETIME}}?',
          'Are there any capacity issues affecting {{APP}}?',
          'How is my application scaling?',
          'How is {{APP}} scaling?',
          "How's my application scaling?",
          "How's {{APP}} scaling?",
          "How's my app scaling?",
          'how are we scaling {{DATETIME}}?',
        ],
        lifecycleEvents: [
          'gatherData',
          'decide',
          'scalability',
        ],
        clarification: 'I think you were asking about scalability.',
      },
    };

    this.hooks = {
      'scalability:gatherData': exchange => this.gatherData(exchange),
      'scalability:decide': (exchange, context) => this.decide(exchange, context),
      'scalability:scalability': (exchange, context) => this.scalability(exchange, context),
    };
  }

  gatherData(exchange) {
    if (_.isNil(_.get(exchange, 'model.request.analysed.timeRange.startTime'))) {
      // Set timeRange to past week
      _.set(exchange, 'model.request.analysed.timeRange.startTime', moment().subtract(1, 'weeks').valueOf());
      _.set(exchange, 'model.request.analysed.timeRange.stopTime', moment().valueOf());
    }

    return this.davis.dynatrace.getFilteredProblems(exchange)
      .then((problems) => {
        // We are only interested in application problems
        const applications = _.filter(problems.toArray(), problem =>
            problem.impactLevel === 'APPLICATION');

        this.davis.logger.debug(`Found ${applications.length} application problems.`);

        // We are only interested in problems with infrastructure impacts
        const infrastructure = _.filter(applications, problem =>
            problem.affectedCounts.INFRASTRUCTURE + problem.recoveredCounts.INFRASTRUCTURE > 0);

        this.davis.logger.debug(`Found ${infrastructure.length} recovered infrastructure related application problems.`);

        const filtered = _.map(infrastructure, (problem) => {
          problem.rankedImpacts = _.filter(problem.rankedImpacts, impact =>
              impact.impactLevel === 'INFRASTRUCTURE');
          return problem;
        });

        exchange.addContext({
          totalProblemCount: filtered.length,
          problems: _.take(filtered, 3),
        });
      });
  }

  decide(exchange, context) {
    const problems = context.problems.length;

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
