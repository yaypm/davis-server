'use strict';

const BbPromise = require('bluebird');

class MultipleChoice {
  constructor(davis, options) {
    this.davis = davis;
    this.options = options;

    this.intents = {
      multipleChoice: {
        usage: 'Answer a multiple choice question',
        phrases: [
          '0',
          '1',
          '1st',
          '2nd',
          '3',
          '3rd',
          'all of them',
          'both',
          'bottom',
          'first one',
          'first',
          'how about {{DATETIME}} issue',
          'how about {{DATETIME}} problem',
          'i would like to know more about the third one',
          "I'm not interested in any of those",
          'last',
          'middle',
          'neither of those',
          'none of those',
          'none',
          'number 1',
          'number three',
          'tell me about the second one please',
          'Tell me about {{DATETIME}}',
          'Tell me more about the first one',
          'Tell me more about the second one',
          'Tell me more about {{DATETIME}} problem.',
          'the first one',
          'the middle one',
          'third',
          'top',
        ],
        lifecycleEvents: [
          'multipleChoice',
        ],
      },
    };

    this.hooks = {
      'multipleChoice:multipleChoice': (exchange) => BbPromise.resolve(exchange).bind(this)
        .then(this.multipleChoice),
    };
  }

  multipleChoice(exchange) {
    this.davis.logger.debug(exchange);
  }
}

module.exports = MultipleChoice;
