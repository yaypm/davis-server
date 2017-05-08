"use strict";

const Plugin = require("../../../core/plugin");

class Previous extends Plugin {
  constructor() {
    super(...arguments);
    this.name = "previous";
  }

  async ask(req) {
    const paging = req.context.paging;
    if (paging.page === 0) {
      return { text: "You are already on the first page" };
    }
    req.context.set("paging.page", paging.page - 1);
    return this.davis.plugins.showPage.run(req);
  }
}

module.exports = Previous;
