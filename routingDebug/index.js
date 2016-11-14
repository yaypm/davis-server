'use strict';

const _ = require('lodash');
const BbPromise = require('bluebird');

class RoutingDebug {
  constructor(davis, options) {
    this.davis = davis;
    this.options = options;
    this.dir = __dirname;

    this.intents = {
      startRoutingDebug: {
        usage: 'Debug the routing intent',
        phrases: [
          'Debug the routing intent',
        ],
        lifecycleEvents: [
          'ask',
        ],
      },

      routingDebug: {
        usage: 'Debug the routing intent',
        phrases: [
        ],
        lifecycleEvents: [
          'respond',
        ],
      },
    };

    this.hooks = {
      'startRoutingDebug:ask': this.ask,
      'routingDebug:respond': (exchange, context) => BbPromise.resolve([exchange, context]).bind(this)
        .spread(this.debug),
    };
  }

  ask(exchange) {
    exchange
      .setConversationContextProperty('targetIntent', 'routingDebug')
      .response('Debugging routing.').skipFollowUp();
  }

  debug(exchange, context) {
    // const context = exchange.getConversationContext();
    const choice = _.isNumber(context.choice) ? context.choice + 1 : context.choice;
    const templates = this.davis.pluginManager.responseBuilder.getTemplates(this);
    exchange.addTemplateContext({ choice }).response(templates).skipFollowUp();
  }
}

module.exports = RoutingDebug;
