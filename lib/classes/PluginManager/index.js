'use strict';

const path = require('path');
const _ = require('lodash');
const BbPromise = require('bluebird');
const Nlp = require('./Nlp');
const ResponseBuilder = require('./ResponseBuilder');
const AliasesModel = require('../../models/Aliases');


class PluginManager {
  constructor(davis) {
    this.logger = davis.logger;

    this.nlp = new Nlp(this, {});
    this.responseBuilder = new ResponseBuilder(davis);

    this.plugins = [];
    this.intents = {};
    this.hooks = {};
    this.options = {};

    this.entities = {
      applications: [],
      services: [],
    };

    this.stats = {
      plugins: {
        core: 0,
        user: 0,
      },
    };

    this.davis = davis;
  }

  setOptions(options) {
    this.options = options;
  }

  loadEntities() {
    return BbPromise.all([
      this.davis.dynatrace.getApplicationEntities(),
      this.davis.dynatrace.getServiceEntities(),
    ])
      .spread((applications, services) => {
        this.logger.info(`Found ${applications.length} applications running ${services.length} services.`);
        return BbPromise.all([
          this._setApplicationEntities(applications),
          this._setServiceEntities(services),
        ]);
      })
      .then(() => this.logger.info('Finished loading entities.'))
      .catch(() => this.logger.warn('Unable to load entities.'));
  }

  _setApplicationEntities(applications) {
    const nonSynthetic = _.filter(applications, app => app.applicationType !== 'SYNTHETIC');

    return BbPromise.map(nonSynthetic, app =>
      AliasesModel.findOne({ entityId: app.entityId })
        .exec()
        .then((alias) => {
          if (!_.isNil(alias)) return alias;
          const name = app.customizedName || app.displayName;
          return new AliasesModel({
            name,
            category: 'applications',
            entityId: app.entityId,
            display: {
              visual: name,
              audible: name,
            },
            aliases: [name],
          }).save();
        }))
    .then((apps) => {
      this.nlp.apps = apps;
      this.entities.applications = apps;
    });
  }

  _setServiceEntities(services) {
    this.entities.services = services;
  }

  addPlugin(Plugin) {
    const pluginInstance = new Plugin(this.davis, this.options);
    if (!_.isString(pluginInstance.dir)) {
      pluginInstance.dir = path.join(this.davis.dir, Plugin.dir);
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
        Plugin.dir = path.join(path.relative(this.davis.dir, plugin));
        this.addPlugin(Plugin);
        n += 1;
      } catch (e) {
        // Log and stop davis if a plugin fails to load
        this.davis.utils.logError(e, true);
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
    const userIntents = plugins
      .map(userIntentPath => path.join(process.cwd(), userIntentPath));

    const n = this.loadPlugins(userIntents);

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
      const phrases = details.phrases || [];
      this.nlp.addDocuments(phrases, key);
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
    return this.nlp.train();
  }

  run(exchange, forceIntent, didYouMean) {
    exchange.depth += 1;
    this.logger.debug(`Exchange depth ${exchange.depth}`);
    if (exchange.depth > exchange.maxDepth) {
      const msg = 'Maximum recursion depth exceeded';
      this.logger.error(msg);
      throw new this.davis.classes.Error(msg);
    }
    return BbPromise.resolve()
      .then(() => {
        const nonLetters = /[^A-Za-zА-Яа-я0-9 ]+/g;
        const phrase = exchange.getRawRequest();

        if (forceIntent) {
          const intent = this.getIntent(forceIntent);
          this.logger.info(`Running forced "${forceIntent}" intent`);
          let proc;
          if (intent.nlp) {
            proc = this.nlp.process(exchange);
          } else {
            proc = BbPromise.resolve();
          }
          return proc
            .then((ret) => {
              const nlpData = (didYouMean) ? exchange.getContext().oldNlp : ret || {};
              nlpData.intent = forceIntent;
              nlpData.probabilities = [];
              exchange.addNlpData(nlpData);
              return this._runIntent(intent, exchange);
            });
        }

        // match on regex intents
        const rePhrase = phrase.replace(nonLetters, '');
        let reIntent = null;
        _.forIn(this.intents, (intent, key) => {
          if (intent.regex && intent.regex.test(rePhrase)) {
            reIntent = key;
            this.logger.debug(`Matched on ${key} intent regex.`);
          }
        });
        if (reIntent) return this.run(exchange, reIntent);

        this.logger.info('Classifying intent');
        return this.nlp.process(exchange)
          .then((nlpData) => {
            const classified = this.nlp.classify(nlpData.stripped);
            _.merge(nlpData, classified);

            const value = nlpData.probabilities[0].value;
            if (nlpData.intent !== 'unknown') {
              this.logger.info(`Classified as ${nlpData.intent} with probability ${value}`);
            }

            exchange.addNlpData(nlpData);
            const intent = this.getIntent(classified.intent);
            return this._runIntent(intent, exchange);
          });
      });
  }

  _runIntent(intent, exchange) {
    exchange.intents.push(intent.key);
    const events = this.getEvents(intent);
    const hooks = _.flatMap(events, event => this.hooks[event] || []);

    if (hooks.length === 0) {
      const errorMessage = `The intent ${intent} did not catch on any hooks`;
      throw new this.davis.classes.Error(errorMessage);
    }

    return BbPromise.reduce(hooks, (__, hook) => {
      this.logger.debug(`running hook: ${hook.event}`);
      return hook(exchange, exchange.getContext());
    }, null)
      .then(() => {
        // skip building response on routing exchanges
        if (exchange.built) {
          this.logger.debug(`skipping building on ${intent.key}`);
          return exchange.save();
        }
        this.logger.debug(`building ${intent.key}`);
        this.responseBuilder.build(exchange);
        exchange.built = true;
        return exchange.save();
      });
  }

  _runHook(hookName) {
    const hooks = this.hooks[hookName] || [];
    if (hooks.length === 0) {
      const errorMessage = `The hook ${hookName} was not found`;
      throw new this.davis.classes.Error(errorMessage);
    }
  }
}

module.exports = PluginManager;
