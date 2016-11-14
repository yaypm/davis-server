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
      'problemNotification:notify': (exchange, context) => this.notify(exchange, context),
    }
  }


  // Expects a pid to be on the conversationContext object
  gatherData(exchange, context) {
    console.log('gatherData');
    const pid = context.pid;
    return this.davis.dynatrace.problemDetails(pid)
      .then(ret => {
        const problem = ret.result;
        exchange.addTemplateContext({ problem });
      })
  }

  notify(exchange, context) {
    const templates = this.davis.pluginManager.responseBuilder.getTemplates(this);
    console.log('notify', context.problem);
    exchange
      .response(templates)
      .end();
  }
}

module.exports = ProblemNotification;
