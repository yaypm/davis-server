'use strict';

const _ = require('lodash');

const model = require('./model');

class Problem {
  constructor(davis, options) {
    this.davis = davis;
    this.options = options;

    this.intents = {
      problem: {
        usage: 'Discover problems',
        phrases: [
          "what's up?",
          'what is up?',
          "How's {{APP}} doing?",
          'any issues',
          'Are there any issues at the moment?',
          'Are there any on going issues?',
          'Did anything happen to {{APP}} {{DATETIME}}?',
          'Did anything happen to {{APP}}?',
          'Did anything happen with {{APP}} {{DATETIME}}?',
          'Did anything happen {{DATETIME}}',
          'Did anything happen',
          'Did anything happened to {{APP}} {{DATETIME}}?',
          'did anything happened {{DATETIME}}?',
          'what happened with {{APP}} {{DATETIME}}',
          'What happened {{DATETIME}} with {{APP}}?',
          'What happened {{DATETIME}}?',
        ],
        lifecycleEvents: [
          'gatherData',
          'decide',
          'problem',
        ],
        nlp: true,
        clarification: 'I think you were asking about problems.',
      },
    };

    this.hooks = {
      'problem:gatherData': exchange => this.gatherData(exchange),
      'problem:decide': (exchange, context) => this.decide(exchange, context),
      'problem:problem': (exchange, context) => this.problem(exchange, context),
    };
  }

  gatherData(exchange) {
    return this.davis.dynatrace.getFilteredProblems(exchange)
      .then((problems) => {
        const tense = this.davis.utils.getTense(exchange);
        const context = {
          totalProblemCount: problems.toArray().length,
          problems: _.take(problems.toArray(), 3),
          tense,
        };

        exchange.addContext(context);
      });
  }

  decide(exchange, context) {
    const problems = context.problems.length;
    const tense = context.tense;
    const nlp = exchange.getNlpData();
    const app = nlp.app;
    const filtered = Boolean(app.name);

    const out = exchange.decide.predict(model, { tense, problems, filtered });

    if (out.followUp) {
      exchange.followUp(out.question);
    } else {
      exchange.skipFollowUp();
    }

    exchange.addContext({
      templateDir: out.template,
      appname: app.name,
    });
  }

  problem(exchange, context) {
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

module.exports = Problem;
