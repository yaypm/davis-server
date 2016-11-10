'use strict';

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
        const context = {
          num_problems: problems.length,
          problem1: problems[0],
          problem2: problems[1],
          problem3: problems[2],
        };

        exchange.addTemplateContext(context)
          .addConversationContext(context);
      });
  }

  decide(exchange, context) {
    const n = context.num_problems;
    const tense = this.davis.utils.getTense(exchange);

    let count = 'many';
    exchange.followUp('Would you be interested in hearing more about the first, second, or third problem?');
    if (n === 0) {
      count = 'zero';
      exchange.skipFollowUp();
    } else if (n === 1) {
      count = 'one';
      exchange.followUp('Would you like me to analyze this further for you?');
    } else if (n === 2) {
      count = 'two';
      exchange.followUp('Would you like to know more about the first problem or the second one?');
    }

    exchange.addConversationContext({
      templateDir: `tense/${tense}/${count}`,
      tense,
    });
  }

  problem(exchange, context) {
    const templates = this.davis.pluginManager.responseBuilder
      .getTemplates(this, context.templateDir);

    exchange
      .addConversationContext({
        targetIntent: 'problemDetails',
      })
      .response(templates);

    if (context.tense === 'future') {
      exchange.skipFollowUp();
    }
  }
}

module.exports = Problem;
