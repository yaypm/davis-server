"use strict";

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
   *
   *
   * @param {IDavisRequest} req
   * @returns {Promise<IDavisResponse>}
   *
   * @memberOf Plugin
   */
  async run(req) {
    logger.info(`Executing plugin ${this.name}`);
    const start = process.hrtime();
    const res = await this.ask(req);
    const end = process.hrtime();
    const plugTime = ((end[0] * 1000000 + end[1] / 1000) - (start[0] * 1000000 + start[1] / 1000)) / 1000;
    logger.debug(`Plugin responded in ${plugTime.toFixed()} ms`);
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
  async button(req) {
    return {
      show: { text: "This plugin did not implement a button" },
      text: "This plugin did not implement a button",
    };
  }
}

module.exports = Plugin;
