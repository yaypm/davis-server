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
const Slack = require('./sources/Slack');
const Version = require('./../package.json').version;

// Allows users to define config defaults
require('dotenv').config({ silent: true });

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
    this.userPlugins = configObject.userPlugins || [];

    this.classes = {};
    this.classes.Error = Utils.DError;
    this.classes.Exchange = Exchange;

    this.sources = {};
    this.sources.alexa = new Alexa(this);
    this.sources.slack = new Slack(this);
  }

  run() {
    this.logger.asciiGreeting();

    const asyncSetup = BbPromise.resolve()
      .then(() => this.service.connectToMongoDB())
      .then(() => this.config.load())
      .then(() => [
        this.dynatrace.getApplicationEntities(),
        this.dynatrace.getServiceEntities(),
      ])
      .spread((applications, services) => [
        this.pluginManager.setApplicationEntities(applications),
        this.pluginManager.setServiceEntities(services),
        this.logger.info(`Found ${applications.length} applications running ${services.length} services.`),
      ])
      .spread(() => {
        const admin = this.users.adminExists()
          .then(exists => {
            if (!exists) {
              return this.users.createDefaultUser();
            }
            return null;
          });
        return admin;
      });

    let n;
    this.logger.info('Learning everything there is to know about APM.');
    n = this.pluginManager.loadCorePlugins();
    this.logger.debug(`Loaded ${n} core plugins`);
    n = this.pluginManager.loadUserPlugins(this.userPlugins);
    this.logger.debug(`Loaded ${n} user plugins`);
    this.logger.info('Training the NLP model');
    this.pluginManager.train();
    this.logger.info("I would say it's safe to consider me an APM expert now!");

    return asyncSetup
      .then(() => this.server.start())
      .then(() => this.sources.slack.init());
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
