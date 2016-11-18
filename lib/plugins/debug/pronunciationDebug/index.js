'use strict';

class PronunciationDebug {
  constructor(davis, options) {
    this.davis = davis;
    this.options = options;

    this.intents = {
      pronounceDebug: {
        usage: 'Debug pronunciation parser',
        phrases: [
          'Debug the pronunciation parser',
        ],
        lifecycleEvents: [
          'pronounceDebug',
        ],
        regex: /^debug pronunciation/,
      },
    };

    this.hooks = {
      'pronounceDebug:pronounceDebug': (exchange, context) => {
        const templates = this.davis.pluginManager.responseBuilder.getTemplates(this);
        exchange
          .response(templates)
          .skipFollowUp();
      },
    };
  }

}

module.exports = PronunciationDebug;
