'use strict';

const _ = require('lodash');

class PushLink {
  constructor(davis, options) {
    this.davis = davis;
    this.options = options;

    this.intents = {
      pushLink: {
        usage: 'Push link to user via socket to Chrome extension',
        lifecycleEvents: [
          'pushLink',
        ],
        phrases: [],
      },
    };

    this.hooks = {
      'pushLink:pushLink': (exchange, context) => this.pushLink(exchange, context),
    };
  }

  pushLink(exchange, context) { // eslint-disable-line consistent-return
    const choice = context.choice;
    // user gave a yes/no answer
    if (_.isBoolean(choice)) {
      if (choice) { // user said yes
        const linkUrl = exchange.getLinkUrl();
        if (_.isNil(linkUrl)) {
          this.davis.logger.warn('linkUrl undefined');
          exchange.response('Sorry, the link is unavailable.').end();
        } else {
          this.davis.server.pushLinkToUser(exchange.user, linkUrl);
          exchange.response('I\'m sending the link to you now!').end();
        }
      } else { // user said no
        exchange
          .response('Ok.')
          .followUp('Would you like to hear about another problem?')
          .addContext({ targetIntent: 'problemDetails' });
      }
    } else {
      // if user didn't answer yes or no, did they mean to ask about another problem?
      return this.davis.pluginManager.run(exchange, 'problemDetails');
    }
  }
}

module.exports = PushLink;