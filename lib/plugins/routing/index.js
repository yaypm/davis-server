'use strict';

const BbPromise = require('bluebird');

class Routing {
  constructor(davis, options) {
    this.davis = davis;
    this.options = options;

    this.intents = {
      routing: {
        usage: 'Routing betweeen question and answer intents',
        phrases: [
          '0',
          'one',
          'two',
          'three',
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
          'absolutely not',
          'naw',
          'No thanks.',
          'no',
          'No.',
          'nope',
          'absolutely',
          'go for it',
          'ok',
          'okay',
          'please',
          'yes please',
          'Yes.',
        ],
        lifecycleEvents: [
          'choice',
        ],
      },
    };

    this.hooks = {
      'routing:choice': (exchange) => BbPromise.resolve(exchange).bind(this)
        .then(this.choice),
    };
  }

  choice(exchange) {
    const req = exchange.getRawRequest();

    this.davis.logger.debug(`mc target: ${exchange.getConversationContext().targetIntent}`);

    if (req === 'yes') {
      exchange.setConversationContextProperty('choice', true);
    } else if (req === 'no') {
      exchange.setConversationContextProperty('choice', false);
    } else if (req === 'one') {
      exchange.setConversationContextProperty('choice', 0);
    } if (req === 'two') {
      exchange.setConversationContextProperty('choice', 1);
    } if (req === 'three') {
      exchange.setConversationContextProperty('choice', 2);
    }
  }
}

module.exports = Routing;
