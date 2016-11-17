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
      'pushLink:pushLink': (exchange) => this.pushLink(exchange),
    };
  }

  pushLink(exchange) {
    const linkUrl = exchange.getLinkUrl();
    if (_.isNil(linkUrl)) {
      this.davis.logger.warn('linkUrl undefined');
      exchange.response('Sorry, the link is unavailable.').end();
    } else {
      this.davis.server.pushLinkToUser(exchange.user, linkUrl);
      exchange.response('I\'m sending the link to you now!').end();
    }
  }
}

module.exports = PushLink;
