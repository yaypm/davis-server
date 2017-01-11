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
      '(please )?(how about|tell me|(I would|Id) like to know)? ?(more)? ?(about)? ?(the )?(top|first|1st) ?(1|one|issue|problem)? ?(please|thanks|thank you)?',
    ];

    this.twoRegex = [
      '(please )?(how about|tell me|(I would|Id) like to know)? ?(more)? ?(about)? ?(issue|problem|number)? ?(number)? ?(2|two)( please)?',
      '(please )?(how about|tell me|(I would|Id) like to know)? ?(more)? ?(about)? ?(the )?(second|2nd) ?(1|one|issue|problem)? ?(please|thanks|thank you)?',
    ];

    this.threeRegex = [
      '(please )?(how about|tell me|(I would|Id) like to know)? ?(more)? ?(about)? ?(issue|problem|number)? ?(number)? ?(3|three)( please)?',
      '(please )?(how about|tell me|(I would|Id) like to know)? ?(more)? ?(about)? ?(the )?(third|3rd) ?(1|one|issue|problem)? ?(please|thanks|thank you)?',
    ];

    this.lastRegex = [
      '(please )?(how about|tell me|(I would|Id) like to know)? ?(more)? ?(about)? ?(the )?(last|bottom) ?(1|one|issue|problem)? ?(please|thanks|thank you)?',
    ];

    this.middleRegex = [
      '(please )?(how about|tell me|(I would|Id) like to know)? ?(more)? ?(about)? ?(the )?middle ?(1|one|issue|problem)? ?(please|thanks|thank you)?',
    ];

    this.yesRegex = [
      '(please |thanks|thank you)?(yes|sure|absolutely|definitely|go for it|ok(ay)?|please) ?(please|thanks|thank you)?',
    ];

    this.noRegex = [
      '(please|thanks|thank you)? ?(no|nope|naw|absolutely not|nothing) ?(please|thanks|thank you)?',
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
        usage: 'Routing between question and answer intents',
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
          'sure',
          'Yes.',
        ],
        lifecycleEvents: [
          'choice',
        ],

        regex: new RegExp(this.exactMatches.join('|'), 'i'),
      },
    };

    this.hooks = {
      'routing:choice': exchange => BbPromise.resolve(exchange).bind(this)
        .then(this.choice),
    };
  }

  choice(exchange) {
    const req = exchange.getRawRequest();
    const target = exchange.getContext().targetIntent || 'unknown';

    this.davis.logger.debug(`routing target: ${target}`);

    const yesR = new RegExp(this.yesRegex.join('|'), 'i');
    const noR = new RegExp(this.noRegex.join('|'), 'i');
    const oneR = new RegExp(this.oneRegex.join('|'), 'i');
    const twoR = new RegExp(this.twoRegex.join('|'), 'i');
    const threeR = new RegExp(this.threeRegex.join('|'), 'i');
    const lastR = new RegExp(this.lastRegex.join('|'), 'i');
    const middleR = new RegExp(this.middleRegex.join('|'), 'i');
    const allR = new RegExp(this.allRegex.join('|'), 'i');

    if (yesR.test(req)) {
      this.davis.logger.debug('routing matched yes');
      exchange.setContextProperty('choice', true);
    } else if (noR.test(req)) {
      this.davis.logger.debug('routing matched no');
      exchange.setContextProperty('choice', false);
    } else if (twoR.test(req)) {
      this.davis.logger.debug('routing matched two');
      exchange.setContextProperty('choice', 1);
    } else if (threeR.test(req)) {
      this.davis.logger.debug('routing matched three');
      exchange.setContextProperty('choice', 2);
    } else if (lastR.test(req)) {
      this.davis.logger.debug('routing matched last');
      exchange.setContextProperty('choice', 'last');
    } else if (middleR.test(req)) {
      this.davis.logger.debug('routing matched middle');
      exchange.setContextProperty('choice', 'middle');
    } else if (allR.test(req)) {
      this.davis.logger.debug('routing matched all');
      exchange.setContextProperty('choice', 'all');
    } else if (oneR.test(req)) { // this must be last "the last one", "the first one", etc.
      this.davis.logger.debug('routing matched one');
      exchange.setContextProperty('choice', 0);
    } else {
      this.davis.logger.debug('no match');
      exchange.setContextProperty('choice', false);
    }

    return this.davis.pluginManager.run(exchange, target);
  }
}

module.exports = Routing;
