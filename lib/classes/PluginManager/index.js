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
    if (_.isString(pluginInstance.dir)) {
      pluginInstance.dir = path.relative(this.davis.dir, pluginInstance.dir);
    } else {
      pluginInstance.dir = Plugin.dir;
    }

    this.loadIntents(pluginInstance);
    this.loadHooks(pluginInstance);

    this.logger.debug(`Loaded plugin: ${pluginInstance.constructor.name}`);

    this.plugins.push(pluginInstance);
  }

  loadPlugins(plugins) {
    let n = 0;
    _.forEach(plugins, (plugin) => {
      try {
        const Plugin = require(plugin); // eslint-disable-line
        Plugin.dir = path.join(path.relative(this.davis.dir, plugin), '..');
        this.addPlugin(Plugin);
        n++;
      } catch (e) {
        this.logger.error(e.message);
      }
    });
    return n;
  }

  loadCorePlugins() {
    const intentsDirectoryPath = path.join(__dirname, '../../plugins');

    this.logger.info(`Loading plugins in ${intentsDirectoryPath}`);
    const coreIntents = this.davis.utils
      .readFileSync(path.join(intentsDirectoryPath, 'Plugins.json')).intents
      .map(coreIntentPath => path.join(intentsDirectoryPath, coreIntentPath));

    this.logger.debug(`Found ${coreIntents.length} plugin candidates`);

    const n = this.loadPlugins(coreIntents);
    this.numCorePlugins = n;
    return n;
  }

  loadUserPlugins(plugins) {
    let n = 0;
    _.forEach(plugins, plugin => {
      this.addPlugin(plugin);
      n++;
    });
    this.numUserPlugins = n;
    return n;
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

  train() {
    this.nlp.train();
  }

  run(exchange, forceIntent) {
    return BbPromise.resolve()
      .then(() => {
        const routing = this.getIntent('routing');
        const nonLetters = /[^A-Za-zА-Яа-я0-9 ]+/g;
        const phrase = exchange.getRawRequest();

        if (forceIntent) {
          this.logger.info(`Running forced "${forceIntent}" intent`);
          return this.nlp.process(exchange)
            .then(nlpData => {
              nlpData.intent = forceIntent;
              nlpData.probabilities = [{ forceIntent: 1 }];
              exchange.addNlpData(nlpData);
              return this._runHooks(this.getIntent(forceIntent), exchange);
            });
        }

        if (routing.regex.test(phrase.replace(nonLetters, ''))) {
          this.logger.info(`"${phrase}" matched on routing regex`);
          return this._runhooks(routing, exchange);
        }

        this.logger.info('Classifying intent');
        return this.nlp.process(exchange)
          .then(nlpData => {
            const classified = this.nlp.classify(nlpData.stripped);
            _.merge(nlpData, classified);

            const value = nlpData.probabilities[0].value;
            if (nlpData.intent !== 'unknown') {
              this.logger.info(`Classified as ${nlpData.intent} with probability ${value}`);
            }

            exchange.addNlpData(nlpData);
            const intent = this.getIntent(classified.intent);
            return this._runHooks(intent, exchange);
          });
      })
      .then(() => {
        this.responseBuilder.build(exchange);
        return exchange.save();
      });
  }

  _runHooks(intent, exchange) {
    const events = this.getEvents(intent);
    const hooks = _.flatMap(events, event => this.hooks[event] || []);

    if (hooks.length === 0) {
      const errorMessage = `The intent ${intent} did not catch on any hooks`;
      throw new this.davis.classes.Error(errorMessage);
    }

    return BbPromise.reduce(hooks, (__, hook) => {
      this.logger.debug(`running hook: ${hook.event}`);
      return hook(exchange, exchange.getConversationContext());
    }, null)
      .then(() => {
        this.responseBuilder.build(exchange);
        return exchange.save();
      });
  }
}

module.exports = PluginManager;
