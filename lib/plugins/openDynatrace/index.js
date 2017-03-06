'use strict';

const _ = require('lodash');

class OpenDynatrace {
  constructor(davis, options) {
    this.davis = davis;
    this.options = options;

    this.intents = {
      openDynatrace: {
        skipHelp: true,
        usage: 'Open browser tab and navigate to Dynatrace dashboard',
        examples: [
          'Open Dynatrace',
          'Show dashboard',
        ],
        phrases: [
          'open dynatrace',
          'show me dynatrace',
          'show dynatrace',
          'display dynatrace',
          'dynatrace dashboard',
          'open dashboard',
          'show dashboard',
        ],
        lifecycleEvents: [
          'openDynatrace',
        ],
        clarification: 'I think you were asking me to open a new tab and go to your Dynatrace dashboard.',
      },
    };

    this.hooks = {
      'openDynatrace:openDynatrace': this.openDynatrace.bind(this),
    };
  }

  openDynatrace(exchange) {

    const response = {
      success: "Okay, no problem, here's your Dynatrace dashboard.",
      failure: "I can show you your Dynatrace dashboard but first you'll need to download the davis Chrome Extension and connect to davis with it. Look for a download link under the Chrome section in the davis Account Settings."
    };

    // Logic for pushing link to web UI or Chrome Extension based on input source, will add support in the future
      // if (this.davis.server.isSocketConnected(exchange.user) && exchange.getRequestSource() !== 'Web') {
        // this.davis.server.pushLinkToUser(exchange.user, this.davis.config.getDynatraceUrl());
        // exchange.response(response.success).end();
      // } else if (exchange.getRequestSource() === 'Web') {
      //   exchange
      //     .setLinkUrl(this.davis.config.getDynatraceUrl())
      //     .response(response.success).end();
      // } else {
      //   exchange.response(response.failure).end();
      // }
    
    // Push link to Chrome Extension if socket is connected
    if (this.davis.server.isSocketConnected(exchange.user)) {
      this.davis.server.pushLinkToUser(exchange.user, this.davis.config.getDynatraceUrl());
      exchange.response(response.success).end();
    } else {
      exchange.response(response.failure).end();
    }
  }
}

module.exports = OpenDynatrace;
