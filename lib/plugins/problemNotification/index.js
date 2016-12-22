'use strict';

class ProblemNotification {
  constructor(davis, options) {
    this.davis = davis;
    this.options = options;

    this.intents = {
      problemNotification: {
        usage: 'Notify users proactively',
        lifecycleEvents: [
          'gatherData',
          'notify',
        ],
        phrases: [],
      },
    };

    this.hooks = {
      'problemNotification:gatherData': (exchange, context) => this.gatherData(exchange, context),
      'problemNotification:notify': exchange => this.notify(exchange),
    };
  }


  // Expects a pid to be on the conversationContext object
  gatherData(exchange, context) {
    const pid = context.pid;
    return this.davis.dynatrace.problemDetails(pid)
      .then((ret) => {
        const problem = ret.result;
        exchange.addContext({ problem });
      });
  }

  notify(exchange) {
    const templates = this.davis.pluginManager.responseBuilder.getTemplates(this);
    exchange
      .response(templates)
      .end();
  }
}

module.exports = ProblemNotification;
