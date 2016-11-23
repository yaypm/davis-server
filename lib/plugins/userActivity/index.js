'use strict';

const _ = require('lodash');

class UserActivity {
  constructor(davis, options) {
    this.davis = davis;
    this.options = options;

    this.intents = {
      userActivity: {
        usage: 'Ask about current activity levels',
        phrases: [
          'can you tell me about user activity levels {{DATETIME}}?',
          'give me an update on user activity',
          'use activity {{APP}} {{DATETIME}}',
          'user activity {{APP}} {{DATETIME}}',
        ],
        lifecycleEvents: [
          'userActivity',
        ],
        regex: /user activity/i,
        nlp: true,
      },
    };

    this.hooks = {
      'userActivity:userActivity': (exchange, context) => {

        const params = {
          timeseriesId: 'com.dynatrace.builtin:app.useractionsperminute',
          queryMode: 'series',
          aggregationType: 'count',
        };

        return this.davis.dynatrace.getFilteredTimeseriesData(exchange, params)
          .then(result => {
            const dataPoints = result.result.dataPoints;
            // const appId = _.invert(result.result.entities)[app];
            // const appData = dataPoints[appId];
            // console.log(appData);
            exchange.response('Logging all datapoints for development purposes');
          });
      },
    };
  }
}

module.exports = UserActivity;
