"use strict";

const Plugin = require("../../../core/plugin");
const logger = require("../../../core/logger");

class Yes extends Plugin {
  constructor() {
    super(...arguments);
    this.name = "yes";
  }

  async ask(req) {
    logger.debug({ choice: { type: "boolean", choice: true } });
    const target = req.context.targets.yes.intent;
    if (!target) {
      return {
        text: "I'm sorry, but I'm not sure what you mean.",
      };
    }
    return this.davis.plugins[target]._yes(req);
  }
}

module.exports = Yes;
