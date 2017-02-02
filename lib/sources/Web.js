'use strict';

const _ = require('lodash');
const moment = require('moment');

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
    let dUser;

    return this.users.getUser(req.decoded.email)
      .then((user) => {
        dUser = user;
        const timezone = _.get(req, 'body.timezone', user.timezone);
        const exchange = new this.Exchange(this.davis, user);
        if (user.timezone !== timezone) {
          this.davis.logger.info(`The user has ${user.timezone} set as their timezone but the browser is reported ${timezone}.`);
        }
        exchange.setTimezone(timezone);
        return exchange.start(this._getRawRequest(req), this._getSourceType(req), `${WEB_REQUEST_SOURCE}:${user.email}`);
      })
      .then((exchange) => {
        const intent = _.get(req, 'body.intent');
        // button === { value, name }
        const button = _.get(req, 'body.button');
        const action_ts = moment().unix();
        const clicker = `${dUser.name.first} ${dUser.name.last}`.trim();

        if (button) {
          if (!button.name || button.value === undefined) throw new this.davis.classes.Error('Button must have value and name');
        }

        exchange.button = Boolean(button);
        exchange.addContext({
          button,
          clicker,
        });

        return this.pluginManager.run(exchange, intent);
      })
      .then(exchange => this._formatResponse(exchange))
      .catch(err => this._formatErrorResponse(err));
  }

  _getRawRequest(req) {
    return _.get(req, 'body.phrase', ' ');
  }

  _getSourceType(req) {
    return _.get(req, 'body.sourceType', WEB_REQUEST_SOURCE);
  }

  _formatResponse(exchange) {
    const response = _.assign({}, _.get(exchange, 'model.response'));
    const intents = exchange.intents;
    response.audible.ssml = `<ssml>${response.audible.ssml}</ssml>`;
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
