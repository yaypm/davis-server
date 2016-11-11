'use strict';

const BbPromise = require('bluebird');

class Routing {
  constructor(davis, options) {
    this.davis = davis;
    this.options = options;

    this.zeroRegex = [
      '(please )?(how about|tell me|(I would|Id) like to know)? ?(more)? ?(about)? ?(issue|problem|number)? ?(number)? ?(0|zero)( please)?',
    ];

    this.oneRegex = [
      '(please )?(how about|tell me|(I would|Id) like to know)? ?(more)? ?(about)? ?(issue|problem|number)? ?(number)? ?(1|one)( please)?',
      '(please )?(how about|tell me|(I would|Id) like to know)? ?(more)? ?(about)? ?(the )?(top|first|1st) ?(one|issue|problem)? ?(please|thanks|thank you)?',
    ];

    this.twoRegex = [
      '(please )?(how about|tell me|(I would|Id) like to know)? ?(more)? ?(about)? ?(issue|problem|number)? ?(number)? ?(2|two)( please)?',
      '(please )?(how about|tell me|(I would|Id) like to know)? ?(more)? ?(about)? ?(the )?(second|2nd) ?(one|issue|problem)? ?(please|thanks|thank you)?',
    ];

    this.threeRegex = [
      '(please )?(how about|tell me|(I would|Id) like to know)? ?(more)? ?(about)? ?(issue|problem|number)? ?(number)? ?(3|three)( please)?',
      '(please )?(how about|tell me|(I would|Id) like to know)? ?(more)? ?(about)? ?(the )?(third|3rd) ?(one|issue|problem)? ?(please|thanks|thank you)?',
    ];

    this.lastRegex = [
      '(please )?(how about|tell me|(I would|Id) like to know)? ?(more)? ?(about)? ?(the )?(last|bottom) ?(one|issue|problem)? ?(please|thanks|thank you)?',
    ];

    this.middleRegex = [
      '(please )?(how about|tell me|(I would|Id) like to know)? ?(more)? ?(about)? ?(the )?middle ?(one|issue|problem)? ?(please|thanks|thank you)?',
    ];

    this.yesRegex = [
      '(please |thanks|thank you)?(yes|absolutely|defintely|go for it|ok(ay)?|please) ?(please|thanks|thank you)?',
    ];

    this.noRegex = [
      '(please|thanks|thank you)? ?(no|nope|naw|absolutely not) ?(please|thanks|thank you)?',
      '(please|thanks|thank you)? ?(none|neither)( of (them|those))? ?(please|thanks|thank you)?',
      '(please|thanks|thank you)? ?(Im|I am) not interested in (either|any)( of (them|those))? ?(please|thanks|thank you)?',
    ];

    this.allRegex = [
      '(please|thanks|thank you)? ?both ?(issues|problems)? ?(please|thanks|thank you)?',
      '(please|thanks|thank you)? ?(all|any) ?(three|3)? ?(issues|problems|of (them|those))? ?(please|thanks|thank you)?',
    ];

    this.exactMatches = [
      this.zeroRegex.map(s => `^${s}$`).join('|'),
      this.oneRegex.map(s => `^${s}$`).join('|'),
      this.twoRegex.map(s => `^${s}$`).join('|'),
      this.threeRegex.map(s => `^${s}$`).join('|'),
      this.middleRegex.map(s => `^${s}$`).join('|'),
      this.lastRegex.map(s => `^${s}$`).join('|'),
      this.yesRegex.map(s => `^${s}$`).join('|'),
      this.noRegex.map(s => `^${s}$`).join('|'),
      this.allRegex.map(s => `^${s}$`).join('|'),
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

        regex: new RegExp(this.exactMatches.join('|'), 'i'),
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
    } else if (lastR.test(req)) {
      this.davis.logger.debug('matched last');
      exchange.setConversationContextProperty('choice', 'last');
    } else if (middleR.test(req)) {
      this.davis.logger.debug('matched middle');
      exchange.setConversationContextProperty('choice', 'middle');
    } else if (allR.test(req)) {
      this.davis.logger.debug('matched all');
      exchange.setConversationContextProperty('choice', 'all');
    } else if (oneR.test(req)) { // this must be last "the last one", "the first one", etc.
      this.davis.logger.debug('matched one');
      exchange.setConversationContextProperty('choice', 0);
    } else {
      this.davis.logger.debug('no match');
      exchange.setConversationContextProperty('choice', false);
    }
  }
}

module.exports = Routing;
