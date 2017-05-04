"use strict";

const Plugin = require("../../../core/plugin");

class DetailProblem extends Plugin {
  constructor() {
    super(...arguments);
    this.name = "detailProblem";
  }

  /**
   * Numeric choice handler
   *
   * @param {IDavisRequest} req
   * @param {Number} choice
   * @returns
   *
   * @memberOf DetailProblem
   */
  async choose(req, choice) {
    const choices = req.context.targets.num.choices;
    return {
      text: `You chose problem ${choices[choice]}`,
    };
  }
}

module.exports = DetailProblem;
