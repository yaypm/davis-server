"use strict";

const Plugin = require("../../../core/plugin");
const sb = require("../../../util/builder").sb;
const Dynatrace = require("../../../core/dynatrace");

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
   * @returns {IDavisResponse}
   *
   * @memberOf DetailProblem
   */
  async choose(req, choice) {
    const choices = req.context.targets.num.choices;
    return {
      text: `You chose problem ${choices[choice]}`,
    };
  }

  async listItem(req, id) {
    const details = await Dynatrace.problemDetails(req.user, id);
    return {
      text: sb(req.user).s("a").h(details.rankedEvents[0].eventType)
        .s("on").e(details.rankedEvents[0].entityId, details.rankedEvents[0].entityName),
      value: details,
    };
  }
}

module.exports = DetailProblem;
