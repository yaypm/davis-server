"use strict";

const Plugin = require("../../../core/plugin");

class PageRoute extends Plugin {
  constructor() {
    super(...arguments);
    this.name = "pageRoute";
  }

  async yes(req, value) {
    return this.davis.plugins[value.target]._yes(req, value.id);
  }

  async no(req, value) {
    return this.davis.plugins[value.target]._no(req, value.id);
  }
}

module.exports = PageRoute;
