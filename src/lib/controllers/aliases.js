"use strict";

const mongoose = require("mongoose");

const AliasModel = require("../models/alias");

/**
 *
 * @class Aliases
 */
class Aliases {
  /**
   * Create new Alias
   *
   * @static
   * @param {IAlias} spec
   * @returns {Promise<IAliasModel>}
   *
   * @memberOf Aliases
   */
  static async create(spec) {
    const model = new AliasModel(spec);
    return model.save();
  }

  /**
   * Get Alias by MongoID
   *
   * @static
   * @param {string} id
   * @returns {Promise<IAliasModel>}
   *
   * @memberOf Aliases
   */
  static async getById(id) {
    return AliasModel.findById(id);
  }

  /**
   * Get list of Aliases by tenant ID
   *
   * @static
   * @param {string} tenant
   * @returns {Promise<IAliasModel[]>}
   *
   * @memberOf Aliases
   */
  static async getByTenant(tenant) {
    return AliasModel.find({ tenant });
  }

  static async getAll() {
    return AliasModel.find();
  }
}

module.exports = Aliases;
