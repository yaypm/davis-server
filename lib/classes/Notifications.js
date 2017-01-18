'use strict';

const BbPromise = require('bluebird');

// Notification Event Namespaces
const EVENT_PROBLEM = 'davis.notification.problem';

class Notifications {
  constructor(davis) {
    this.logger = davis.logger;

    this.davis = davis;
  }

  dynatraceProblem(notification) {
    if (notification.ProblemID === 'TESTID') {
      this.logger.info('Received a custom integration test connection');
      return BbPromise.resolve();
    }

    return BbPromise.try(() => {
      if (!notification.PID) throw new this.davis.classes.Error('The incoming notification was missing a PID element!');
      if (!notification.ProblemID) throw new this.davis.classes.Error('The incoming notification was missing a ProblemID element!');
    }).then(() => this.davis.users.getSystemUser())
    .then((user) => {
      const exchange = new this.davis.classes.Exchange(this.davis, user);
      return exchange.startInternal();
    })
    .then(exchange => exchange.addContext({ pid: notification.PID }))
    .then(exchange => this.davis.pluginManager.run(exchange, 'problemNotification'))
    .then(exchange => this.davis.event.emit(EVENT_PROBLEM, exchange))
    .catch(err => this.davis.utils.logError(err));
  }

  getProblemNamespace() {
    return EVENT_PROBLEM;
  }
}

module.exports = Notifications;
