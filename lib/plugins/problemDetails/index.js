'use strict';

const BbPromise = require('bluebird');
const _ = require('lodash');
const tagger = require('./tagger');
const model = require('./model');

class ProblemDetails {
  constructor(davis, options) {
    this.davis = davis;
    this.options = options;

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
      'after:routing:choice': (exchange, context) => BbPromise.resolve([exchange, context]).bind(this)
        .spread(this.problemDetails),
    };
  }

  problemDetails(exchange, context) {
    const problems = [context.problem1, context.problem2, context.problem3];
    const choice = context.choice;
    let idx = -1;

    if (context.targetIntent === 'problemDetails') {
      if (_.isNumber(choice) & choice <= 2) {
        idx = choice;
      } else if (_.isBoolean(choice)) {
        if (!choice) {
          exchange.response('Ok').end();
          return;
        }
      } else if (_.isString(choice)) {
        if (choice === 'middle') {
          idx = (problems.length / 2).toFixed();
        } else if (choice === 'last') {
          idx = problems.length - 1;
        }
      }
    }

    if (idx !== -1) {
      const pid = problems[idx].id;
      return this.davis.dynatrace.problemDetails(pid) // eslint-disable-line
        .then(ret => {
          const problem = ret.result;
          const tags = tagger.tag(problem, exchange);
          const templateDir = exchange.decide.predict(model, tags);
          const templates = this.davis.pluginManager.responseBuilder
            .getTemplates(this, templateDir);

          exchange
            .addTemplateContext({
              problem,
            })
            .response(templates).smartEnd();
        });
    }
  }
}

module.exports = ProblemDetails;
