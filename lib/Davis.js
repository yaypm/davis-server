'use strict';

const Logger = require('./classes/Logger');
const Events = require('./classes/Events');
const Config = require('./classes/Config');
const Utils = require('./classes/Utils');
const Service = require('./classes/Service');
const Server = require('./server/Server');
const PluginManager = require('./classes/PluginManager');
const User = require('./classes/User');
const DError = require('./classes/Error').DError;
const Version = require('./../package.json').version;

class Davis {
  constructor(config) {
    const configObject = config || {};


    this.version = Version;

    this.logger = new Logger(this, configObject.logLevel);
    this.event = new Events(this);
    this.utils = new Utils(this);

    configObject.servicePath = configObject.servicePath || this.utils.findServicePath();
    this.config = new Config(this, configObject);
    this.service = new Service(this);
    this.server = new Server(this);

    this.pluginManager = new PluginManager(this);

    this.classes = {};
    this.classes.Error = DError;
    this.classes.User = User;
  }

  init() {
    // load plugins
    // this.nlp.train()
    // connect to mongo
    // connect to slack
    //
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
