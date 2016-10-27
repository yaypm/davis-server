'use strict';

const _ = require('lodash');
const moment = require('moment-timezone');

const WEEK_THRESHOLD = 1;
const DAY_THRESHOLD = 1;
const HOUR_THRESHOLD = 1;

class Greeter {
  constructor(davis) {
    this.logger = davis.logger;

    this.davis = davis;
  }

  greet(exchange) {
    // TODO Finish
    const timezone = exchange.getTimezone();

    return 'Hi buddy!';
  }

  getName(user, prefixWithComma) {
    let name = _.get(user, 'name.first', '');
    if (prefixWithComma === true) name = `, ${name}`;
    return name;
  }

  timeOfDay(time, timezone) {
    let response;

    const hourOfDay = moment.tz(time, timezone).hour();
    const afternoon = 12;
    const evening = 17;

    if (hourOfDay >= afternoon && hourOfDay <= evening) {
      response = 'afternoon';
    } else if (hourOfDay >= evening) {
      response = 'evening';
    } else {
      response = 'morning';
    }

    return response;
  }
}

module.exports = Greeter;
