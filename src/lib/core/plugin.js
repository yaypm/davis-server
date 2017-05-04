"use strict";

const Util = require("../util");
const logger = require("./logger");

/**
 *
 *
 * @export
 * @class Plugin
 */
class Plugin {
  parseSlots(user, slots) {
    return slots;
  }

  /**
   * Plugin main method wrapper
   *
   * @param {IDavisRequest} req
   * @returns
   *
   * @memberOf RangeProblem
   */
  async run(req) {
    logger.debug(`Executing ${this.name}`);
    const timer = Util.timer();
    const res = await this.ask(req);
    const elapsed = timer();
    res.intent = res.intent || this.name;
    logger.debug(`Executed ${this.name} in ${elapsed} ms`);
    return res;
  }

  /**
   *
   *
   * @param {IDavisButton} req
   * @returns {Promise<IDavisButtonResponse>}
   *
   * @memberOf Plugin
   */
  async button() {
    return {
      show: { text: "This plugin did not implement a button" },
      text: "This plugin did not implement a button",
    };
  }
}

module.exports = Plugin;
