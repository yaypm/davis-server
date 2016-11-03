'use strict';

const Botkit = require('botkit');
const BotkitStorage = require('botkit-storage-mongo');

class Slack {
  constructor(davis) {
    this.logger = davis;

    this.controller = Botkit.slackbot({
      debug: true,
      interactive_replies: true,
      storage: BotkitStorage({ mongoUri: davis.config.getMongoDBConnectionString() }),
    }).configureSlackApp({
      clientId: davis.config.getSlackClientId(),
      clientSecret: davis.config.getSlackClientSecret(),
      redirectUri: davis.config.getSlackRedirectUri(),
      scopes: [
        'incoming-webhook', 'team:read', 'users:read', 'channels:read',
        'im:read', 'im:write', 'groups:read', 'emoji:read', 'chat:write:bot',
      ],
    });
    this.davis = davis;
  }


}

module.exports = Slack;
