'use strict';

const BbPromise = require('bluebird');

class Stop {
  constructor(davis, options) {
    this.davis = davis;
    this.options = options;

    this.intents = {
      stop: {
        usage: 'Stop DAVIS from listening',
        phrases: [
          'alexa stop',
          'bye',
          'exit',
          'I dont need any help',
          "I'm finished",
          'leave me alone',
          'never mind',
          "no, that's all",
          'nope, not at the moment',
          'nothing {{DATETIME}}',
          'nothing',
          "nothings, that's it",
          'off',
          'see ya davis',
          'see ya',
          'shut up',
          'talk to you later',
          "thanks that's it",
          'thanks thats all',
          "that's it for{{DATETIME}}",
        ],
        lifecycleEvents: [
          'stop',
        ],
      },
    };

    this.hooks = {
      'stop:stop': (exchange) => BbPromise.resolve(exchange).bind(this)
        .then(this.stop),
    };
  }

  stop(exchange) {
    this.davis.logger.debug(exchange);
  }
}

module.exports = Stop;
