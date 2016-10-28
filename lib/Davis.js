'use strict';

const BbPromise = require('bluebird');
const Config = require('./classes/Config');
const DError = require('./classes/Error').DError;
const Events = require('./classes/Events');
const Exchange = require('./classes/Exchange');
const Logger = require('./classes/Logger');
const PluginManager = require('./classes/PluginManager');
const Service = require('./classes/Service');
const Users = require('./classes/Users');
const Utils = require('./classes/Utils');
const Server = require('./server/Server');
const Alexa = require('./sources/Alexa');
const Version = require('./../package.json').version;
const Decide = require('./classes/Decide');

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
    this.users = new Users(this);

    this.pluginManager = new PluginManager(this);

    this.classes = {};
    this.classes.Error = DError;
    this.classes.Exchange = Exchange;
    this.classes.Decide = Decide;

    this.sources = {};
    this.sources.alexa = new Alexa(this);
  }

  run() {
    this.logger.asciiGreeting();
    this.logger.info('Initializing...');

    return BbPromise.resolve()
      .then(() => this.pluginManager.loadCorePlugins())
      .then(() => this.service.connectToMongoDB())
      .then(() => {
        return this.users.adminExists()
          .then(exists => {
            if (!exists) {
              return this.users.createUser('admin@localhost', 'changeme', true);
            }
          });
      })
      .then(() => this.logger.info('Starting...'))
      .then(() => this.server.start());
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
