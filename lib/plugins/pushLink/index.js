'use strict';

const _ = require('lodash');

class PushLink {
  constructor(davis, options) {
    this.davis = davis;
    this.options = options;

    this.intents = {
      showMe: {
        usage: 'Push link to browser',
        lifecycleEvents: [
          'showMe',
        ],
        phrases: [
          'Push that to my browser.',
          'Show me in my browser.',
          'Send me that link.',
          'Show me that link.',
          'Send that to my browser.',
        ],
        regex: /^show me$|^open (that|this)$/i,
        clarification: 'I think you were asking me to send a link to your browser.',
      },
      pushLink: {
        skipHelp: true,
        usage: 'Push link to user via socket to Chrome extension',
        lifecycleEvents: [
          'pushLink',
        ],
        phrases: [],
      },
    };

    this.hooks = {
      'showMe:showMe': (exchange) => {
        exchange.addContext({ choice: true });
        return this.davis.pluginManager.run(exchange, 'pushLink');
      },
      'pushLink:pushLink': this.pushLink.bind(this),
    };
  }

  pushLink(exchange, context) { // eslint-disable-line consistent-return
    const choice = context.choice;
    const linkUrl = exchange.getLinkUrl();

    if (!this.davis.server.isSocketConnected(exchange.user)) {
      return exchange.response("It looks like you don't have the chrome extension configured. See the help on the github wiki page.");
    }

    if (_.isNil(choice)) {
      this.davis.server.pushLinkToUser(exchange.user, linkUrl);
      if (linkUrl) {
        return exchange.response("I'm sending the link to you now!");
      }
      return exchange.response("I couldn't find a link to send you.");
    }

    // user gave a yes/no answer
    if (_.isBoolean(choice)) {
      if (choice) { // user said yes
        if (_.isNil(linkUrl)) {
          this.davis.logger.warn('linkUrl undefined');
          exchange.response('Sorry, the link is unavailable.');
        } else {
          this.davis.server.pushLinkToUser(exchange.user, linkUrl);
          exchange.response("I'm sending the link to you now!");
        }
      } else { // user said no
        exchange
          .addContext({ targetIntent: 'problemDetails' })
          .response('OK, no problem.')
          .followUp('Would you like to hear about another problem?');
      }
    } else if (!_.isNil(choice)) {
      // if user didn't answer yes or no, did they mean to ask about another problem?
      return this.davis.pluginManager.run(exchange, 'problemDetails');
    }
  }
}

module.exports = PushLink;
