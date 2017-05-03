"use strict";

const Plugin = require("../../core/plugin");
const sb = require("../../util/builder").sb;

class DateProblem extends Plugin {
  constructor() {
    super(...arguments);
    this.name = "dateProblem";
  }

  async ask(req) {
    return {
      text: sb(req.user)
      .s("I'm sorry, I can't analyze problems by date at the moment,")
      .s("however it appears that you asked about").s(req.slots.date).p,
    };
  }
}

module.exports = DateProblem;
