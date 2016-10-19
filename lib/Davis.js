'use strict';

const Logger = require('./classes/Logger');
const Events = require('./classes/Events');
const Config = require('./classes/Config');
const Utils = require('./classes/Utils');
const Service = require('./classes/Service');
const Server = require('./server/Server');
const IntentManager = require('./classes/IntentManager');
const User = require('./classes/User');
const Error = require('./classes/Error');
const Version = require('./../package.json').version;

class Davis {
  constructor(config) {
    let configObject = config;
    configObject = configObject || {};

    this.version = Version;

    this.logger = new Logger(this, configObject.logLevel);
    this.event = new Events(this);
    this.config = new Config(this, configObject);
    this.utils = new Utils(this);
    this.service = new Service(this);
    this.server = new Server(this);

    this.intentManager = new IntentManager(this);

    this.classes = {};
    this.classes.Error = Error;
    this.classes.User = User;
  }

  run() {
    this.logger.asciiGreeting();
    this.logger.info('Starting...');
    this.service.connectToMongoDB();
    this.server.start();
  }

  /**
   * Returns the version number found in package.json
   * @returns {string} - Version number
   * @memberOf Davis
   */
  getVersion() {
    return this.version;
  }

}

module.exports = Davis;
