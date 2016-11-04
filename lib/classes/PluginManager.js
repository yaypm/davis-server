'use strict';

const path = require('path');
const _ = require('lodash');
const BbPromise = require('bluebird');
const Nlp = require('./Nlp');
const ResponseBuilder = require('./ResponseBuilder');

class PluginManager {
  constructor(davis) {
    this.logger = davis.logger;

    this.nlp = new Nlp(this, {});
    this.responseBuilder = new ResponseBuilder(davis);

    this.plugins = [];
    this.intents = {};
    this.hooks = {};
    this.options = {};

    this.davis = davis;
  }

  setOptions(options) {
    this.options = options;
  }

  addPlugin(Plugin) {
    const pluginInstance = new Plugin(this.davis, this.options);
    pluginInstance.dir = Plugin.dir;

    this.loadIntents(pluginInstance);
    this.loadHooks(pluginInstance);

    this.logger.debug(`Loaded plugin: ${pluginInstance.constructor.name}`);

    this.plugins.push(pluginInstance);
  }

  loadPlugins(plugins) {
    _.forEach(plugins, (plugin) => {
      try {
        const Plugin = require(plugin); // eslint-disable-line
        Plugin.dir = path.join(path.relative(this.davis.dir, plugin), '..');
        this.addPlugin(Plugin);
      } catch (e) {
        this.logger.error(e.message);
      }
    });
  }

  loadCorePlugins() {
    const intentsDirectoryPath = path.join(__dirname, '../plugins');

    this.logger.info(`Loading plugins in ${intentsDirectoryPath}`);
    const coreIntents = this.davis.utils
      .readFileSync(path.join(intentsDirectoryPath, 'Plugins.json')).intents
      .map(coreIntentPath => path.join(intentsDirectoryPath, coreIntentPath));

    this.logger.debug(`Found ${coreIntents.length} plugin candidates`);

    this.loadPlugins(coreIntents);
    this.logger.debug(`Loaded ${this.plugins.length} plugins`);
    this.nlp.train();
  }

  loadIntent(pluginName, details, key) {
    const intents = details.intents;

    return _.assign({}, details, { key, pluginName, intents });
  }

  loadIntents(pluginInstance) {
    const pluginName = pluginInstance.constructor.name;
    _.forEach(pluginInstance.intents, (details, key) => {
      this.nlp.addDocuments(details.phrases, key);
      const intent = this.loadIntent(pluginName, details, key);
      this.intents[key] = _.merge({}, this.intents[key], intent);
    });
  }

  loadHooks(intentInstance) {
    _.forEach(intentInstance.hooks, (hook, event) => {
      this.hooks[event] = this.hooks[event] || [];
      hook.event = event;
      this.hooks[event].push(hook);
    });
  }

  getIntents() {
    return this.intents;
  }

  getIntent(intent) {
    if (intent in this.intents) {
      return this.intents[intent];
    }
    const errorMessage = `Intent ${intent} not found`;
    throw new this.davis.classes.Error(errorMessage);
  }

  getEvents(intent) {
    return _.flatMap(intent.lifecycleEvents, event => [
      `before:${intent.key}:${event}`,
      `${intent.key}:${event}`,
      `after:${intent.key}:${event}`,
    ]);
  }


  run(exchange) {
    const nonLetters = /[^A-Za-zА-Яа-я0-9 ]+/g;
    let phrase = exchange.getRawRequest();
    this.logger.debug(`Raw: "${phrase}"`);
    phrase = phrase.replace(nonLetters, '');
    this.logger.debug(`Stripped: "${phrase}"`);
    const routing = this.getIntent('routing');
    const regex = new RegExp(routing.exactMatches.join('|'), 'i');
    if (regex.test(phrase)) {
      this.logger.info(`"${phrase}" matched on routing regex`);
      const events = this.getEvents(routing);
      const hooks = _.flatMap(events, event => this.hooks[event] || []);
      return BbPromise.reduce(hooks, (__, hook) => {
        this.logger.debug(`running hook: ${hook.event}`);
        return hook(exchange);
      }, null)
        .then(() => {
          this.responseBuilder.build(exchange);
          return exchange.finish();
        });
    }
    this.logger.debug('no exact match');

    return this.nlp.classify(exchange)
      .then((nlpData) => {
        // nlpData: {text, intent, probabilities, stripped, datetime, app}
        exchange.addNlpData(nlpData);
        const intent = this.getIntent(nlpData.intent);
        const value = nlpData.probabilities[0].value;
        if (nlpData.intent !== 'unknown') {
          this.logger.info(`Classified as ${nlpData.intent} with probability ${value}`);
        }
        const events = this.getEvents(intent);
        const hooks = _.flatMap(events, event => this.hooks[event] || []);

        if (hooks.length === 0) {
          const errorMessage = 'The intent did not catch on any hooks';
          throw new this.davis.classes.Error(errorMessage);
        }
        return BbPromise.reduce(hooks, (__, hook) => {
          this.logger.debug(`running hook: ${hook.event}`);
          return hook(exchange);
        }, null);
      })
      .then(() => {
        this.responseBuilder.build(exchange);
        return exchange.finish();
      });
  }
}

module.exports = PluginManager;
