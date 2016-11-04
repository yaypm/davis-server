'use strict';

const BbPromise = require('bluebird');

class Routing {
  constructor(davis, options) {
    this.davis = davis;
    this.options = options;

    this.zeroRegex = [
      '(how about|tell me( more)? about)? ?(issue|problem)? ?(0|zero)',
    ];

    this.oneRegex = [
      '(how about|tell me( more)? about)? ?(issue|problem)? ?(1|one)',
      '(how about|tell me( more)? about)? ?(the )?(top|first|1st) ?(one|issue|problem)?',
    ];

    this.twoRegex = [
      '(how about|tell me( more)? about)? ?(issue|problem)? ?(2|two)',
      '(how about|tell me( more)? about)? ?(the )?(second|2nd) ?(one|issue|problem)?',
    ];

    this.threeRegex = [
      '(how about|tell me( more)? about)? ?(issue|problem)? ?(3|three)',
      '(how about|tell me( more)? about)? ?(the )?(third|3rd) ?(one|issue|problem)?',
    ];

    this.lastRegex = [
      '(how about|tell me( more)? about)? ?(the )?(last|bottom) ?(one|issue|problem)?',
    ];

    this.middleRegex = [
      '(how about|tell me( more)? about)? ?(the )?middle ?(one|issue|problem)?',
    ];

    this.yesRegex = [
      'yes',
    ];

    this.noRegex = [
      'no',
      'none( of them)?',
    ];

    this.allRegex = [
      'both ?(issues|problems)?',
      'all (three|3)? ?(issues|problems|of them)?',
    ];

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

        exactMatches: [
          this.zeroRegex.map(s => `^${s}$`).join('|'),
          this.oneRegex.map(s => `^${s}$`).join('|'),
          this.twoRegex.map(s => `^${s}$`).join('|'),
          this.threeRegex.map(s => `^${s}$`).join('|'),
          this.middleRegex.map(s => `^${s}$`).join('|'),
          this.lastRegex.map(s => `^${s}$`).join('|'),
          this.yesRegex.map(s => `^${s}$`).join('|'),
          this.noRegex.map(s => `^${s}$`).join('|'),
          this.allRegex.map(s => `^${s}$`).join('|'),
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

    const yesR = new RegExp(this.yesRegex.join('|'));
    const noR = new RegExp(this.noRegex.join('|'));
    const oneR = new RegExp(this.oneRegex.join('|'));
    const twoR = new RegExp(this.twoRegex.join('|'));
    const threeR = new RegExp(this.threeRegex.join('|'));
    const lastR = new RegExp(this.lastRegex.join('|'));
    const middleR = new RegExp(this.middleRegex.join('|'));
    const allR = new RegExp(this.allRegex.join('|'));

    if (yesR.test(req)) {
      this.davis.logger.debug('matched yes');
      exchange.setConversationContextProperty('choice', true);
    } else if (noR.test(req)) {
      this.davis.logger.debug('matched no');
      exchange.setConversationContextProperty('choice', false);
    } else if (twoR.test(req)) {
      this.davis.logger.debug('matched two');
      exchange.setConversationContextProperty('choice', 1);
    } else if (threeR.test(req)) {
      this.davis.logger.debug('matched three');
      exchange.setConversationContextProperty('choice', 2);
    } else if (oneR.test(req)) {
      this.davis.logger.debug('matched one');
      exchange.setConversationContextProperty('choice', 0);
    } else if (lastR.test(req)) {
      this.davis.logger.debug('matched last');
      exchange.setConversationContextProperty('choice', 'last');
    } else if (middleR.test(req)) {
      this.davis.logger.debug('matched middle');
      exchange.setConversationContextProperty('choice', 'middle');
    } else if (allR.test(req)) {
      this.davis.logger.debug('matched all');
      exchange.setConversationContextProperty('choice', 'all');
    } else {
      this.davis.logger.debug('no match');
      exchange.setConversationContextProperty('choice', false);
    }
  }
}

module.exports = Routing;
