'use strict';

const error = require('../classes/Utils/Error');
const _ = require('lodash');
const BbPromise = require('bluebird');

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
    return BbPromise.resolve();
  }
}

module.exports = Web;
