'use strict';

const BbPromise = require('bluebird');
const _ = require('lodash');
const tagger = require('./tagger');
const model = require('./model');

class ProblemDetails {
  constructor(davis, options) {
    this.davis = davis;
    this.options = options;
    this.urlUtil = davis.utils.url;

    this.intents = {
      problemDetails: {
        usage: 'Problem details',
        phrases: [

        ],
        lifecycleEvents: [
          'problemDetails',
        ],
      },
    };

    this.hooks = {
      'problemDetails:problemDetails': (exchange, context) => BbPromise.resolve([exchange, context]).bind(this)
        .spread(this.problemDetails),
    };
  }

  problemDetails(exchange, context) {
    const problems = context.problems;
    const choice = context.choice;
    let idx = -1;

    if (_.isNumber(choice)) {
      if (choice < problems.length) {
        idx = choice;
      } else {
        exchange.response("There weren't that many problems");
        return;
      }
    } else if (_.isBoolean(choice)) {
      if (!choice) {
        exchange.response('Ok').end();
        return;
      } else if (problems.length === 1) {
        idx = 0;
      } else {
        exchange.response("I'm not sure what you mean by that.").end();
      }
    } else if (_.isString(choice)) {
      if (choice === 'middle') {
        idx = (problems.length / 2).toFixed();
      } else if (choice === 'last') {
        idx = problems.length - 1;
      }
    }

    if (idx !== -1) {
      const pid = problems[idx].id;
      return this.davis.dynatrace.problemDetails(pid) // eslint-disable-line
        .then(ret => {
          const problem = ret.result;
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
          exchange
            .addContext({
              problem,
            })
            .response(templates).smartEnd();
        });
    }
  }
}

module.exports = ProblemDetails;
