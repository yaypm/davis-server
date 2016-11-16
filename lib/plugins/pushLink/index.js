'use strict';

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

  pushLink(exchange, context) {
    this.davis.server.pushLinkToUser(context.user, context.link);
    exchange.response('I\'m sending the link to you now!').end();
  }
}

module.exports = PushLink;
