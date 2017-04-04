'use strict';

const _ = require('lodash');

const thingsToTry = [
  'Try asking if there were any problems yesterday',
  'Try asking me about user activity',
  'Try asking if there are any open issues',
];

class Launch {
  constructor(davis, options) {
    this.davis = davis;
    this.options = options;

    this.intents = {
      launch: {
        skipHelp: true,
        usage: 'Launch Davis',
        phrases: [
          'davis',
          'hey davis',
          'hi davis',
          'launch',
          "let's get started",
          'start davis',
          'start',
          'hello',
          'hey',
          'hi',
          'yo',
        ],
        lifecycleEvents: [
          'launch',
        ],
        regex: /^(davis|(hey|hi|launch|start|ask)( davis))?$/i,
        clarification: 'It sounds like you wanted to chat.',
      },
    };

    this.hooks = {
      'launch:launch': this.launch.bind(this),
    };
  }

  launch(exchange) {
    const response =
      `Hello, I'm davis. ${
        _.sample([
          "What's up?",
          'How can I be of service?',
          'How can I help you?',
        ])
      } ${
      _.sample(thingsToTry)
      }, or say 'help' for more options.`;

    exchange
      .response(response)
      .skipFollowUp();
  }
}

module.exports = Launch;
