'use strict';

const _ = require('lodash');

class Help {
  constructor(davis, options) {
    this.davis = davis;
    this.options = options;

    this.intents = {
      help: {
        usage: 'Ask for help',
        phrases: [
          'Help me please.',
          'Help me.',
          'I could use a little help.',
          'I need help',
          'for some help',
          'to help me',
          'what can you do',
        ],
        lifecycleEvents: [
          'help',
        ],
        regex: /^help$/i,
      },
    };

    this.hooks = {
      'help:help': this.help.bind(this),
    };
  }

  help(exchange) {
    const Card = this.davis.classes.VB.Card;
    const msg = new this.davis.classes.VB.Message();

    const intents = this.davis.pluginManager.intents;
    const intentNames = _.keys(intents);
    const helpCard = new Card();

    const textHelps = [];

    _.map(intentNames, (name) => {
      const intent = intents[name];
      if (intent.skipHelp) return;
      const title = intent.title || intent.usage || name;

      const examples = _.map(_.take(intent.examples || intent.phrases, 3), e => `- ${e}`);

      if (examples.length > 0) {
        textHelps.push(_.sample(examples));
        helpCard.addField(title, examples.join('\n'), true);
      }
    });

    msg.addText('Here are some of the things I can do.')
      .addCard(helpCard);

    exchange.response({
      show: msg.slack(),
      text: `Try asking one of these questions. ${_.sampleSize(textHelps, 5).join(' ')}`,
    }).skipFollowUp();
  }
}

module.exports = Help;
