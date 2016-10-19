'use strict';

const path = require('path');

class IntentManager {
  constructor(davis) {
    this.davis = davis;

    this.intents = [];
  }

  addIntent(Intent) {
    const intentInstance = new Intent(this.davis);

    this.intents.push(intentInstance);
  }

  loadAllIntents(userIntents) {
    this.loadCoreIntents();
    this.loadUserIntents(userIntents);
  }

  loadCorePlugins() {
    const coreIntentDirPath = path.join(__dirname, '../intents');

    const coreIntents = this.davis.utils
      .readFileSync(path.join(coreIntentDirPath, 'Intents.json')).intents
      .map((coreIntentPath) => path.join(coreIntentDirPath, coreIntentPath));

    this.loadIntents(coreIntents);
  }

  loadUserIntents(userIntents) {
    // ToDo
  }
}

module.exports = IntentManager;
