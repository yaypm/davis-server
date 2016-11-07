'use strict';

const BbPromise = require('bluebird');
const Config = require('./classes/Config');
const Exchange = require('./classes/Exchange');
const PluginManager = require('./classes/PluginManager');
const Service = require('./classes/Service');
const Dynatrace = require('./classes/Dynatrace');
const Users = require('./classes/Users');
const Utils = require('./classes/Utils');
const Server = require('./server/Server');
const Alexa = require('./sources/Alexa');
const Version = require('./../package.json').version;

class Davis {
  constructor(config) {
    const configObject = config || {};

    this.version = Version;
    this.dir = process.cwd();

    this.logger = new Utils.Logger(this, configObject.logLevel);
    this.event = new Utils.Events(this);
    this.utils = Utils;

    this.config = new Config(this, configObject);
    this.service = new Service(this);
    this.dynatrace = new Dynatrace(this);
    this.server = new Server(this);
    this.users = new Users(this);

    this.pluginManager = new PluginManager(this);

    this.classes = {};
    this.classes.Error = Utils.DError;
    this.classes.Exchange = Exchange;

    this.sources = {};
    this.sources.alexa = new Alexa(this);
  }

  init() {
    this.logger.asciiGreeting();
    this.pluginManager.nlp.hotStart();

    return BbPromise.resolve()
      .then(() => this.logger.info('Learning everything there is to know about APM.'))
      .then(() => this.pluginManager.loadCorePlugins())
      .then(() => this.logger.info("I would say it's safe to consider me an APM expert now!"))
      .then(() => this.service.connectToMongoDB())
      .then(() => this.config.load())
      .then(() => {
        const admin = this.users.adminExists()
          .then(exists => {
            if (!exists) {
              return this.users.createUser('admin@localhost', 'changeme', true);
            }
            return null;
          });
        return admin;
      });
  }

  run() {
    this.pluginManager.nlp.train();
    return this.server.start();
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
