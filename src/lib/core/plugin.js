"use strict";

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
