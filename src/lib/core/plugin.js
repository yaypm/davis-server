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
  constructor(davis) {
    this.davis = davis;
  }

  parseSlots(user, slots) {
    return slots;
  }

  /**
   * Plugin main method wrapper
   *
   * @param {IDavisRequest} req
   * @returns {IDavisResponse}
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
   * Wrapper for numeric choice handler
   *
   * @param {IDavisRequest} req
   * @param {Number} choice
   * @returns {IDavisResponse}
   *
   * @memberOf Plugin
   */
  async _choose(req, choice) {
    const paging = req.context.paging;
    const first = paging.page * 3;
    const currentPage = paging.items.slice(first, first + 3);

    const value = currentPage[choice];

    logger.debug(`Executing ${this.name}`);
    const timer = Util.timer();
    const res = await this.yes(req, value);
    const elapsed = timer();
    res.intent = res.intent || this.name;
    logger.debug(`Executed ${this.name} in ${elapsed} ms`);
    return res;
  }

  /**
   * Wrapper for yes choice handler
   *
   * @param {IDavisRequest} req
   * @param {any} value
   * @returns {IDavisResponse}
   *
   * @memberOf Plugin
   */
  async _yes(req, value) {
    logger.debug(`Executing ${this.name}`);
    const timer = Util.timer();
    const res = await (this.yes) ? this.yes(req, value) : this.ask(req);
    const elapsed = timer();
    res.intent = res.intent || this.name;
    logger.debug(`Executed ${this.name} in ${elapsed} ms`);
    return res;
  }

  /**
   * Wrapper for no choice handler
   *
   * @param {IDavisRequest} req
   * @param {any} value
   * @returns {IDavisResponse}
   *
   * @memberOf Plugin
   */
  async _no(req, value) {
    logger.debug(`Executing ${this.name}`);
    const timer = Util.timer();
    const res = await (this.no) ? this.no(req, value) : this.ask(req);
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
