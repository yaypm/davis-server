'use strict';

const BbPromise = require('bluebird');

class UserActivity {
  constructor(davis, options) {
    this.davis = davis;
    this.options = options;

    this.intents = {
      userActivity: {
        usage: 'Ask about current activity levels',
        phrases: [
          'can you tell me about do you say rick dvt levels',
          'can you tell me about use rectory levels',
          'can you tell me about use right tivoli lovells',
          'can you tell me about user activity levels?',
          'give me an update on user activity',
        ],
        lifecycleEvents: [
          'userActivity',
        ],
      },
    };

    this.hooks = {
      'userActivity:userActivity': (exchange) => BbPromise.resolve(exchange).bind(this)
        .then(this.userActivity),
    };
  }

  userActivity(exchange) {
    this.davis.logger.debug(exchange);
  }
}

module.exports = UserActivity;
