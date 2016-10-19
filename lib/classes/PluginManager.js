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

    this.intents = [];
    this.hooks = {};
  }

  setOptions(options) {
    this.options = options;
  }

  addIntent(Intent) {
    const intentInstance = new Intent(this.davis, this.options);

    this.loadIntents(intentInstance);
    this.loadHooks(pluginInstance);

    this.intents.push(intentInstance);
  }

  loadIntents(intents) {
    intents.forEach((intent) => {
      const Intent = require(intent);

      this.addIntent(Intent);
    });
  }

  loadCoreIntents() {
    const intentsDirectoryPath = path.join(__dirname, '../plugins');

    const coreIntents = this.davis.utils
      .readFileSync(path.join(intentsDirectoryPath, 'Intents.json')).intents
      .map((coreIntentPath) => path.join(intentsDirectoryPath, coreIntentPath));

    this.loadIntents(coreIntents);
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
    return _.flatmap(intent.lifecycleEvents, (event) => [
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
    const hooks = _.flatmap(events, (event) => this.hooks[event] || []);

    if (hooks.length === 0) {
      const errorMessage = 'The intent did not catch on any hoooks';
      throw new this.serverless.classes.Error(errorMessage);
    }
    // console.log(hooks);
    return BbPromise.reduce(hooks, (__, hook) => hook(exchange), null);
  }
}

module.exports = PluginManager;