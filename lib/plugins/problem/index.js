'use strict';

const model = require('./model');

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
      },
    };

    this.hooks = {
      'problem:gatherData': (exchange) => this.gatherData(exchange),
      'problem:decide': (exchange, context) => this.decide(exchange, context),
      'problem:problem': (exchange, context) => this.problem(exchange, context),
    };
  }

  gatherData(exchange) {
    return this.davis.dynatrace.getFilteredProblems(exchange)
      .then(problems => {
        const tense = this.davis.utils.getTense(exchange);
        const context = {
          num_problems: problems.length,
          problem1: problems[0],
          problem2: problems[1],
          problem3: problems[2],
          tense,
        };

        exchange.addTemplateContext(context)
          .addConversationContext(context);
      });
  }

  decide(exchange, context) {
    const problems = (context.num_problems < 3) ? context.num_problems : 3;
    const tense = context.tense;

    const out = exchange.decide.predict(model, { tense, problems });

    if (out.followUp) {
      exchange.followUp(out.question);
    } else {
      exchange.skipFollowUp();
    }

    exchange.addConversationContext({
      templateDir: out.template,
    });
  }

  problem(exchange, context) {
    const templates = this.davis.pluginManager.responseBuilder
      .getTemplates(this, context.templateDir);

    if (Object.keys(templates).length === 0) {
      throw new this.davis.classes.Error(`Cannot find a template at ${context.templateDir}.`);
    }

    exchange
      .addConversationContext({
        targetIntent: 'problemDetails',
      })
      .response(templates);
  }
}

module.exports = Problem;
