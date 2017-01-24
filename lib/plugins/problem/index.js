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
          'Are there any issues right now?',
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
    exchange
      .setTarget('problemDetails')
      .setLinkUrl(th.buildProblemsUrl(null, exchange.getTimeRange()));

    return this.davis.dynatrace.getFilteredProblems(exchange)
      .then((problems) => {
        const tense = this.davis.utils.getTense(exchange);
        const context = {
          problems: problems.toArray(),
          tense,
        };

        exchange.addContext(context);
      });
  }

  problem(exchange, context) {
    const th = this.davis.textHelpers;
    const VB = this.davis.classes.VB;

    const nlp = exchange.getNlpData();
    const app = nlp.app.name;
    const dateRange = new VB.TimeRange(nlp.timeRange, exchange.user.timezone);

    const problems = _.map(context.problems, problem => this.problemSummary(problem, exchange));

    if (context.tense === 'future') {
      return exchange.response("I can't see the future yet!").smartEnd();
    }

    let leadArr;

    if (context.problems.length === 0) {
      if (context.tense === 'present') {
        if (app) {
          leadArr = ['Looks like no problems are affecting', app, 'right now.'];
        } else {
          leadArr = ['Looks like no problems are occuring right now.'];
        }
        return exchange.response(VB.stringify(leadArr));
      }

      if (app) {
        leadArr = ['Looks like no problems affected', app, dateRange, '.'];
      } else {
        leadArr = ['Looks like no problems occurred', dateRange, '.'];
      }
      return exchange.response({
        show: VB.slackify(leadArr),
        text: VB.stringify(leadArr),
      });
    } else if (context.problems.length === 1) {
      if (context.tense === 'present') {
        if (app) {
          leadArr = ['Looks like one problem is affecting', app, 'right now.'];
        } else {
          leadArr = ['Looks like one problem is occuring right now.'];
        }
      } else if (app) {
        leadArr = ['Looks like one problem affected', app, dateRange, '.'];
      } else {
        leadArr = ['Looks like one problem occurred', dateRange, '.'];
      }
    } else {
      const url = th.buildProblemsUrl(null, exchange.getTimeRange());
      const problemsLink = new VB.Link(url, `${problems.length} problems`);
      if (context.tense === 'present') {
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
    }

    if (context.problems.length > 4) {
      leadArr.push('After giving it some thought, I think you should check out these three issues first.');
    }

    const lead = {
      show: new VB.Card().addText(leadArr).slack(),
      text: VB.stringify(leadArr),
    };

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
}

module.exports = Problem;

