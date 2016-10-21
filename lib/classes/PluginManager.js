'use strict';

const path = require('path');
const _ = require('lodash');
const BbPromise = require('bluebird');
const Nlp = require('./Nlp');

class PluginManager {
  constructor(davis) {
    this.davis = davis;
    this.options = {};
    this.nlp = new Nlp();

    this.plugins = []
    this.intents = {};
    this.hooks = {};
  }

  setOptions(options) {
    this.options = options;
  }

  addPlugin(Plugin) {
    const pluginInstance = new Plugin(this.davis, this.options);

    this.loadIntents(pluginInstance);
    this.loadHooks(pluginInstance);

    this.plugins.push(pluginInstance);
  }

  loadPlugins(plugins) {
    _.forEach(plugins, (plugin) => {
      const Plugin = require(plugin);

      this.addPlugin(Plugin);
    });
  }

  loadCorePlugins() {
    const intentsDirectoryPath = path.join(__dirname, '../plugins');

    const coreIntents = this.davis.utils
      .readFileSync(path.join(intentsDirectoryPath, 'Plugins.json')).intents
      .map((coreIntentPath) => path.join(intentsDirectoryPath, coreIntentPath));

    this.loadPlugins(coreIntents);
  }

  loadIntent(pluginName, details, key) {
    const intents = details.intents;

    return _.assign({}, details, {key, pluginName, intents});
  }

  loadIntents(pluginInstance) {
    const pluginName = pluginInstance.constructor.name;
    _.forEach(pluginInstance.intents, (details, key) => {
      const intent = this.loadIntent(pluginName, details, key);
      this.intents[key] = _.merge({}, this.intents[key], intent);
    });
  }

  loadHooks(intentInstance) {
    _.forEach(intentInstance.hooks, (hook, event) => {
      this.hooks[event] = this.hooks[event] || [];
      this.hooks[event].push(hook);
    });
  }

  getIntents() {
    return this.intents;
  }

  getIntent(intent) {
    if (intent in this.intents) {
      return this.intents[intent];
    } else {
      const errorMessage = `Intent ${intent} not found`;
      throw new this.davis.classes.Error(errorMessage);
    }
  }

  getEvents(intent) {
    return _.flatMap(intent.lifecycleEvents, (event) => [
      `before:${intent.key}:${event}`,
      `${intent.key}:${event}`,
      `after:${intent.key}:${event}`,
    ]);
  }

  getIntents() {
    return this.intents;
  }

  run(exchange) {
    const nlpData = this.nlp.classify(exchange);
    // nlpData: {text, intent, probabilities, stripped, datetime, app}
    exchange.nlpData = nlpData;
    const intent = this.getIntent(nlpData.intent);
    const events = this.getEvents(intent);
    const hooks = _.flatMap(events, (event) => this.hooks[event] || []);

    if (hooks.length === 0) {
      const errorMessage = 'The intent did not catch on any hoooks';
      throw new this.davis.classes.Error(errorMessage);
    }
    return BbPromise.reduce(hooks, (__, hook) => hook(exchange), null);
  }
}

module.exports = PluginManager;