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
   * Choice handler
   *
   * @param {IDavisRequest} req
   * @param {Number} choice
   * @returns {IDavisResponse}
   *
   * @memberOf DetailProblem
   */
  async yes(req, pid) {
    const detail = await Dynatrace.problemDetails(req.user, pid);
    return {
      text: `detailProblem reporting in ${pid}`,
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
