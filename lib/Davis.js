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
const Web = require('./sources/Web');
const Version = require('./../package.json').version;
const path = require('path');
const CronJob = require('cron').CronJob;
const child_process = require('child_process');

// Allows users to define config defaults
require('dotenv').config({ silent: true });

class Davis {
  constructor(config) {
    const configObject = config || {};

    this.version = Version;
    this.dir = path.join(__dirname, '..');

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
    this.sources.web = new Web(this);

    this.cronJobs = {};
  }

  addCron(cronTime, onTick, name, run) {
    const fname = name || 'anonymous cron';

    const fn = function() {
      try {
        this.logger.debug(`CRON: ${fname}`);
        onTick.call(this);
      } catch(e) {
        this.logger.warn(`CRON: ${fname} failed`);
      }
    }

    const cron = new CronJob({
      cronTime,
      onTick: fn,
      start: true,
      context: this,
      runOnInit: Boolean(run),
    });

    this.cronJobs[fname] = cron;
  }

  run() {
    const startTime = Date.now();
    return BbPromise.resolve()
      .then(() => this.logger.asciiGreeting())
      .then(() => this.service.connectToMongoDB())
      .then(() => this.config.load())
      .then(() => {
        this.addCron('0 0 0 * * *', () => {
          this.pluginManager.loadEntities();
        }, 'update entities', true);
      })
      .then(() => {
        const admin = this.users.adminExists()
          .then((exists) => {
            if (!exists) {
              return this.users.createDefaultUser();
            }
            return null;
          });
        return admin;
      })
      .then((admin) => {
        if (!admin) {
          this.logger.info('A default user has been created.');
        }
        let n;
        this.logger.info('Learning everything there is to know about APM.');
        n = this.pluginManager.loadCorePlugins();
        this.pluginManager.stats.plugins.core += n;
        this.logger.debug(`Loaded ${n} core plugins`);
        n = this.pluginManager.loadUserPlugins(this.userPlugins);
        this.pluginManager.stats.plugins.user += n;
        this.logger.debug(`Loaded ${n} user plugins`);
        this.logger.info('Training the NLP model');
        this.pluginManager.train();
        this.logger.info("I would say it's safe to consider me an APM expert now!");
      })
      .then(() => this.server.start())
      .then(() => this.sources.slack.start())
      .then(() => this.logger.info(`Server started successfully after ${Date.now() - startTime} ms.`));
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
module.exports.logError = Utils.logError;
