'use strict';

const _ = require('lodash');

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
    const isInfra = /infrastructure|scalability|scaling|capacity/i.test(exchange.getRawRequest());
    exchange
      .setTarget('problemDetails')
      .setLinkUrl(th.buildProblemsUrl(null, exchange.getTimeRange()));

    return this.davis.dynatrace.getFilteredProblems(exchange)
      .then((ret) => {
        let problems = ret.toArray();
        problems = (isInfra) ?
          _.filter(problems, p =>
            p.impactLevel === 'APPLICATION' &&
            p.affectedCounts.INFRASTRUCTURE + p.recoveredCounts.INFRASTRUCTURE > 0) : problems;
        const tense = this.davis.utils.getTense(exchange);
        const context = {
          problems,
          tense,
          category: (isInfra) ? 'INFRASTRUCTURE' : null,
        };

        exchange.addContext(context);
      });
  }

  problem(exchange, context) {
    const VB = this.davis.classes.VB;

    const nlp = exchange.getNlpData();
    const app = nlp.app.name;
    const dateRange = new VB.TimeRange(nlp.timeRange, exchange.user.timezone);

    const problems = _.map(context.problems, problem => this.problemSummary(problem, exchange));

    if (context.tense === 'future') {
      return exchange.response("I can't see the future yet!").smartEnd();
    }

    let leadArr;

    const problemsLink = this.problemsLink(problems, exchange.getTimeRange(), context.category);

    if (context.problems.length === 0) {
      if (context.tense === 'present') {
        if (app) {
          leadArr = ['Looks like', problemsLink, 'are affecting', app, 'right now.'];
        } else {
          leadArr = ['Looks like', problemsLink, 'are occurring right now.'];
        }
        return exchange.response(VB.stringify(leadArr));
      }

      if (app) {
        leadArr = ['Looks like', problemsLink, 'affected', app, dateRange, '.'];
      } else {
        leadArr = ['Looks like', problemsLink, 'occurred', dateRange, '.'];
      }
      return exchange.response({
        show: VB.slackify(leadArr),
        text: VB.stringify(leadArr),
      });
    } else if (context.problems.length === 1) {
      if (context.tense === 'present') {
        if (app) {
          leadArr = ['Looks like', problemsLink, 'is affecting', app, 'right now.'];
        } else {
          leadArr = ['Looks like', problemsLink, 'is occurring right now.'];
        }
      } else if (app) {
        leadArr = ['Looks like', problemsLink, 'affected', app, dateRange, '.'];
      } else {
        leadArr = ['Looks like', problemsLink, 'occurred', dateRange, '.'];
      }
    } else if (context.tense === 'present') {
      if (app) {
        leadArr = ['Looks like', problemsLink, 'are affecting', app, 'right now.'];
      } else {
        leadArr = ['Looks like', problemsLink, 'are occurring right now.'];
      }
    } else if (app) {
      leadArr = ['Looks like', problemsLink, 'affected', app, dateRange, '.'];
    } else {
      leadArr = ['Looks like', problemsLink, 'occurred', dateRange, '.'];
    }

    if (context.problems.length > 4) {
      leadArr.push('After giving it some thought, I think you should check out these three issues first.');
    }

    const lead = {
      show: new VB.Card().addText(leadArr).slack(),
      text: VB.stringify(leadArr),
    };

    if (exchange.filtered) {
      lead.show.author_icon = 'https://s3.amazonaws.com/dynatrace-davis/assets/images/filter_blue_15_15.png';
      lead.show.author = 'filtered';
    }

    exchange
      .addContext({
        paging: {
          lead,
          intent: 'problemDetails',
          index: 0,
          items: problems,
        },
      });

    return this.davis.pluginManager.run(exchange, 'showPage');
  }

  problemSummary(problem, exchange) {
    const id = problem.id;
    const VB = this.davis.classes.VB;
    const th = this.davis.textHelpers;

    const affectedEntities = _.uniqBy(problem.rankedImpacts, 'entityId').length;
    const topEvent = th.eventTitle(problem.rankedImpacts[0]);
    const timeFrame = new VB.TimeRange(problem, exchange.user.timezone, true);
    const problemTitle = th.problemTitle(problem);

    const show = new VB.Card()
      .setColor(problem.status)
      .addTitle(problemTitle)
      .setLink(th.buildProblemUrl(problem))
      .addField('Time Frame', timeFrame, false)
      .addField('Top Event', topEvent, true)
      .addField('Entities Affected', affectedEntities, true)
      .slack();

    const text = VB.stringify([
      th.friendlyEventFirstAlias(problem.rankedImpacts[0].eventType),
      'affecting',
      affectedEntities,
      'entities.',
    ]);

    return {
      intent: 'problemDetails',
      show,
      text,
      id,
    };
  }

  problemsLink(problems, timeRange, category) {
    const VB = this.davis.classes.VB;
    const num = ['no', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'][problems.length] || problems.length;
    const s = (num !== 'one') ? 's' : '';
    const url = this.davis.textHelpers.buildProblemsUrl(null, timeRange);
    const text = (category) ?
      `${num} ${category.toLowerCase()} related problem${s}` :
      `${num} problem${s}`;
    return new VB.Link(url, text);
  }
}

module.exports = Problem;

