'use strict';

const _ = require('lodash');

const WEB_REQUEST_SOURCE = 'web';

class Web {
  constructor(davis) {
    this.logger = davis.logger;
    this.pluginManager = davis.pluginManager;
    this.users = davis.users;
    this.Exchange = davis.classes.Exchange;

    this.davis = davis;
  }

  askDavis(req) {
    return this.users.getUser(req.decoded.email)
      .then((user) => {
        const timezone = _.get(req, 'body.timezone', user.timezone);
        const exchange = new this.Exchange(this.davis, user);
        exchange.setTimezone(timezone);
        return exchange.start(this._getRawRequest(req), this._getSourceType(req), `${WEB_REQUEST_SOURCE}:${user.email}`);
      })
      .then(exchange => this.pluginManager.run(exchange))
      .then(exchange => this._formatResponse(exchange))
      .catch(err => this._formatErrorResponse(err));
  }

  _getRawRequest(req) {
    return _.get(req, 'body.phrase');
  }

  _getSourceType(req) {
    return _.get(req, 'body.sourceType', WEB_REQUEST_SOURCE);
  }

  _formatResponse(exchange) {
    const response = _.assign({}, _.get(exchange, 'model.response'));
    const intents = exchange.intents;
    return {
      success: true,
      response,
      intents,
    };
  }

  _formatErrorResponse(err) {
    let message;
    if (err.name === 'DavisError') {
      message = err.message;
    } else {
      message = 'Unfortunately an unhandled error has occurred.';
      this.davis.utils.logError(err);
    }
    return {
      success: false,
      response: message,
    };
  }
}

module.exports = Web;
