"use strict";

const ContextModel = require("../models/context");

class Contexts {
  static async getByScope(scope) {
    const context = await ContextModel.findOne({ scope });
    if (context) {
      return context;
    }
    return Contexts.create(scope);
  }

  static async create(scope) {
    const context = new ContextModel({ scope });
    return context.save();
  }
}

module.exports = Contexts;
