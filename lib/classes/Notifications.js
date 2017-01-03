'use strict';

const BbPromise = require('bluebird');
const _ = require('lodash');

class Notifications {
  constructor(davis) {
    this.logger = davis.logger;

    this.davis = davis;
  }

  dynatraceProblem(notification) {
    return BbPromise.try(() => {
      if (!notification.PID) throw new this.davis.classes.Error('The incoming notification was missing a PID element!');
      if (!notification.ProblemID) throw new this.davis.classes.Error('The incoming notification was missing a ProblemID element!');
    }).then(() => {
      if (notification.ProblemID === 'TESTID') {
        this.logger.info('Received a custom integration test connection');
        return BbPromise.resolve();
      }
      return BbPromise.resolve()
        .then(() => {
          
        })
    })
  }

}

module.exports = Notifications;
