'use strict';

const _ = require('lodash');
const Problems = require('../../classes/Dynatrace/Problems');

class Problem {
  constructor(davis, options) {
    this.davis = davis;
    this.options = options;

    this.intents = {
      problem: {
        title: 'Discover problems',
        usage: 'Ask about current or historical problems',
        examples: [
          'What happened yesterday?',
          'What is happening?',
          'Are there any capacity issues right now?',
        ],
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
          'Are there any capacity issues?',
          'Are there any capacity issues {{DATETIME}}?',
          'Are there any capacity issues affecting {{APP}}?',
          'Are there any scalability issues?',
          'Are there any scalability issues {{DATETIME}}?',
          'Are there any scalability issues affecting {{APP}}?',
          'How is my application scaling?',
          'How is {{APP}} scaling?',
          "How's my application scaling?",
          "How's {{APP}} scaling?",
          "How's my app scaling?",
          'how are we scaling {{DATETIME}}?',
          'Tell me about the latest problem.',
          'What was the most recent issue?',
          'What was the latest problem?',
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
      'problem:gatherData': this.gatherData.bind(this),
      'problem:problem': this.problem.bind(this),
    };
  }

  gatherData(exchange) {
    const th = this.davis.textHelpers;
    const VB = this.davis.classes.VB;
    const isInfra = /infrastructure|scalability|scaling|capacity/i.test(exchange.getRawRequest());
    const isLast = /(last|most recent|latest) (issue|problem)/i.test(exchange.getRawRequest());
    const tense = this.davis.utils.getTense(exchange);

    const eContext = {
      isLast,
      tense,
      category: (isInfra) ? 'INFRASTRUCTURE' : null,
    };

    exchange.addExchangeContext(eContext);

    exchange
      .setTarget('problemDetails');

    if (isLast) {
      return this.davis.dynatrace.getFilteredProblems(exchange, { relativeTime: 'day' })
        .then((ret) => {
          const problems = ret.toArray();
          const lastProblem = _.maxBy(problems, p => p.startTime);
          exchange
            .setLinkUrl(th.buildProblemUrl(lastProblem))
            .addContext({ problems: [lastProblem] });
        });
    }

    exchange
      .setLinkUrl(th.buildProblemsUrl(null, exchange.getTimeRange()));

    return this.davis.dynatrace.getFilteredProblems(exchange)
      .then((ret) => {
        const nlp = exchange.getNlpData();
        const dateRange = new VB.TimeRange(nlp.timeRange, exchange.user.timezone);
        const summary = ret.summarize(exchange, dateRange);
        let problems = ret.toArray();
        problems = (isInfra) ?
          _.filter(problems, p =>
            p.impactLevel === 'APPLICATION' &&
            p.affectedCounts.INFRASTRUCTURE + p.recoveredCounts.INFRASTRUCTURE > 0) : problems;

        exchange
          .addContext({ problems, summary });
      });
  }

  problem(exchange, context) {
    const VB = this.davis.classes.VB;

    const nlp = exchange.getNlpData();
    const app = nlp.app.name;

    const problems = _.map(context.problems, problem =>
        Problems.problemSummary(problem, context, 'problemDetails', this.davis));

    problems.forEach((problem) => {
      problem.text = VB.stringify(problem.text);
      problem.show = problem.show.slack();
    });

    if (context.tense === 'future') {
      return exchange.response("I can't see the future yet!").smartEnd();
    }

    if (context.isLast) {
      if (context.problems.length > 0) {
        exchange.selected = context.problems[0].id;
        exchange.addContext({ paging: null });
        return this.davis.pluginManager.run(exchange, 'problemDetails');
      }

      return (app) ?
        exchange.response(`There were no recent issues affecting ${app}.`).smartEnd() :
        exchange.response('There were no recent issues.').smartEnd();
    }


    if (context.problems.length > 4) {
      const tmp = 'After giving it some thought, I think you should focus on these three issues.';
      context.summary.push(tmp);
    }

    const lead = {
      show: new VB.Card().addText(context.summary),
      text: VB.stringify(context.summary),
    };

    lead.show.setFiltered(exchange.filtered);

    lead.show = lead.show.slack();

    exchange
      .addContext({
        paging: {
          lead,
          intent: 'problemDetails',
          index: 0,
          items: problems,
          filtered: exchange.filtered,
        },
      });

    return this.davis.pluginManager.run(exchange, 'showPage');
  }

  problemsLink(problems, timeRange, category) {
    const VB = this.davis.classes.VB;
    const num = this.davis.textHelpers.numString(problems.length);
    const s = (num !== 'one') ? 's' : '';
    const url = this.davis.textHelpers.buildProblemsUrl(null, timeRange);
    const text = (category) ?
      `${num} ${category.toLowerCase()} related problem${s}` :
      `${num} problem${s}`;
    return new VB.Link(url, text);
  }
}

module.exports = Problem;

