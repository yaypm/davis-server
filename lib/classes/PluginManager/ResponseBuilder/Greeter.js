'use strict';

const _ = require('lodash');
const moment = require('moment-timezone');

const WEEK_THRESHOLD = 1;
const DAY_THRESHOLD = 1;
const HOUR_THRESHOLD = 1;

const model = [
  { lastInteraction: 'recent', output: name => `Hi ${name}.` },
  { lastInteraction: 'recent', timeOfDay: 'afternoon', output: name => `Hi ${name}.` },
  { lastInteraction: 'recent', timeOfDay: 'evening', output: name => `Hi ${name}.` },
  { lastInteraction: 'recent', timeOfDay: 'morning', output: name => `Hi ${name}.` },
  { lastInteraction: 'weekend', output: name => `Hope you had a nice weekend ${name}.` },
  { lastInteraction: 'days', output: name => `It has been a few days.  It's good to hear from you again ${name}.` },
  { lastInteraction: 'weeks', output: name => `Hey, it has been a while.  It's good to hear from you again ${name}.` },
  { lastInteraction: 'yesterday', timeOfDay: 'afternoon', output: name => `Good afternoon ${name}!` },
  { lastInteraction: 'yesterday', timeOfDay: 'evening', output: name => `Good evening ${name}!` },
  { lastInteraction: 'yesterday', timeOfDay: 'morning', output: name => `Good morning ${name}!` },
  { lastInteraction: 'hours', timeOfDay: 'afternoon', output: name => `Good afternoon ${name}!` },
  { lastInteraction: 'hours', timeOfDay: 'evening', output: name => `Good evening ${name}!` },
  { lastInteraction: 'hours', timeOfDay: 'morning', output: name => `Good morning ${name}!` },
];

class Greeter {
  constructor(davis) {
    this.logger = davis.logger;

    this.davis = davis;
  }

  greet(exchange) {
    const time = moment();
    const timezone = exchange.getTimezone();
    const lastInteraction = _.get(exchange, 'history.lastInteraction.updatedAt');

    const tags = {
      lastInteraction: this.lastInteraction(time, lastInteraction, timezone),
      timeOfDay: this.timeOfDay(time, timezone),
    };

    const greeting = exchange.decide.predict(model, tags);
    return greeting(_.get(exchange, 'slackUser.name.first', exchange.user.name.first));
  }

  lastInteraction(currentTime, lastInteractionTime, timezone) {
    let response;
    if (_.isNil(lastInteractionTime)) return response;

    const current = moment.tz(currentTime, timezone);
    const last = moment.tz(lastInteractionTime, timezone);
    const diff = moment.duration(current.diff(last));

    if (diff.asHours() < HOUR_THRESHOLD) {
      response = 'recent';
    } else if (current.isoWeekday() === 1 && last.isoWeekday() === 5) {
      this.logger.debug('Today is Monday and we haven\'t spoken since Friday.  Hope you had a nice weekend!');
      response = 'weekend';
    } else if (current.isoWeekday() === (last.isoWeekday() + 1)) {
      this.logger.debug('We spoke yesterday');
      response = 'yesterday';
    } else if (diff.asWeeks() >= WEEK_THRESHOLD) {
      this.logger.debug('We have spoken in the last few weeks');
      response = 'weeks';
    } else if (diff.asDays() >= DAY_THRESHOLD) {
      this.logger.debug('We have spoken in the last few days');
      response = 'days';
    } else if (diff.asHours() >= HOUR_THRESHOLD) {
      this.logger.debug(`We spoke today but after our ${HOUR_THRESHOLD} hour threshold.`);
      response = 'hours';
    }

    return response;
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
