'use strict';

const BbPromise = require('bluebird');
const _ = require('lodash');
const tagger = require('./tagger');
const model = require('./model');
const handlers = require('./handlers');

class ProblemDetails {
  constructor(davis, options) {
    this.davis = davis;
    this.options = options;
    this.urlUtil = davis.utils.url;

    this.intents = {
      problemDetails: {
        skipHelp: true,
        usage: 'Problem details',
        examples: [
          'Tell me about the third problem.',
        ],
        phrases: [

        ],
        lifecycleEvents: [
          'problemDetails',
        ],
        clarification: 'I think you were asking about problem details.',
      },
    };

    this.hooks = {
      'problemDetails:problemDetails': (exchange, context) => BbPromise.resolve([exchange, context]).bind(this)
        .spread(this.problemDetails),
    };
  }

  problemDetails(exchange, context) {
    const problems = context.problems;
    let choice = context.choice;
    let idx = -1;

    if (exchange.isSlackButton) {
      const pid = context.button.value;

      if (pid === 'no') {
        choice = false;
      } else if (pid === 'yes') {
        choice = true;
      } else {
        return this.reply(exchange, pid);
      }
    }

    if (_.isNumber(choice)) {
      if (choice < problems.length) {
        idx = choice;
      } else {
        return exchange.response("There weren't that many problems");
      }
    } else if (_.isBoolean(choice)) {
      if (!choice) {
        return exchange.response('OK, no problem.').end();
      } else if (problems.length === 1) {
        idx = 0;
      } else {
        return exchange.response("Which problem would you like to hear about?").skipFollowUp();
      }
    } else if (_.isString(choice)) {
      if (choice === 'middle') {
        idx = (problems.length / 2).toFixed() - 1;
      } else if (choice === 'last') {
        idx = problems.length - 1;
      }
    }

    if (idx !== -1) {
      const pid = problems[idx].id;
      return this.reply(exchange, pid);
    }

    return exchange.response("I'm not sure what problem you were trying to choose").skipFollowUp();
  }

  reply(exchange, pid) {
    const VB = this.davis.classes.VB;
    const th = this.davis.textHelpers;

    return this.davis.dynatrace.problemDetails(pid) // eslint-disable-line
      .then((ret) => {
        const problem = ret.result;

        const msg = new VB.Message()
          .addText('Below are the problem details you requested')

        // Create cards for ranked events
        problem.groupedEvents = groupEvents(problem);
        const eventCards = _.map(Object.keys(problem.groupedEvents), (e) => {
          const base = handlers.DEFAULT(problem.groupedEvents[e]);
          const handler = _.get(handlers, e);
          if (handler) {
            return handler(problem.groupedEvents[e], base);
          } else {
            this.davis.logger.error(`No handler for ${e}. Using default.`);
          }
          return base;
        });

        const summary = new VB.Card()
          .setColor(problem.status)
          .addTitle(th.problemTitle(problem))
          .setLink(th.buildProblemUrl(problem))
          .addField('Time Frame', new VB.TimeRange(problem, exchange.user.timezone, true), false);

        msg
          .addCard(summary)
          .addCard(eventCards);

        const isSocketConnected = this.davis.server.isSocketConnected(exchange.user);
        const tags = tagger.tag(problem, exchange, isSocketConnected);
        const templateDir = exchange.decide.predict(model, tags);
        const templates = this.davis.pluginManager.responseBuilder
          .getTemplates(this, templateDir);
        if (tags.eligibleToPushLink) {
          exchange.followUp('Would you like me to show you this problem in your browser?')
            .addContext({ targetIntent: 'pushLink' })
            .setLinkUrl(this.urlUtil.topImpactURL(problem, this.davis.config.getDynatraceUrl()));
        }

        templates.show = msg.slack();

        exchange
          .addContext({
            problem,
          })
          .response(templates).smartEnd();
      });
  }
}

function groupEvents(problem) {
  return _.groupBy(problem.rankedEvents, e => e.eventType);
}

module.exports = ProblemDetails;
