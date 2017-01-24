'use strict';

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
      'startRoutingDebug:ask': this.ask.bind(this),
      'routingDebug:respond': this.debug.bind(this),
    };
  }

  ask(exchange) {
    exchange
      .setContextProperty('targetIntent', 'routingDebug')
      .response('Debugging routing.').skipFollowUp();
  }

  debug(exchange) {
    const templates = this.davis.pluginManager.responseBuilder.getTemplates(this);
    exchange.response(templates).skipFollowUp();
  }
}

module.exports = RoutingDebug;
