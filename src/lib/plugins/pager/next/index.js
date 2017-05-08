"use strict";

const Plugin = require("../../../core/plugin");

class Next extends Plugin {
  constructor() {
    super(...arguments);
    this.name = "next";
  }

  async ask(req) {
    const paging = req.context.paging;
    const page = paging.page;
    const first = page * 3;
    const total = paging.items.length;
    if (first + 3 >= total) {
      return { text: "You are already on the last page" };
    }
    req.context.set("paging.page", paging.page + 1);
    return this.davis.plugins.showPage.run(req);
  }
}

module.exports = Next;
