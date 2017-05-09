"use strict";

const _ = require("lodash");

const AliasModel = require("../models/alias");
const logger = require("../core/logger");

/**
 *
 * @class Aliases
 */
class Aliases {
  /**
   * Create new Alias
   *
   * @static
   * @param alias - Entity alias
   * @param alias.entityId
   * @param alias.display.audible
   * @param alias.display.visual
   * @param alias.tenant
   * @returns {Promise}
   *
   * @memberOf Aliases
   */
  static async create(user, alias) {
    const a = _.assign(alias, { tenant: user.tenant });
    const model = new AliasModel(a);
    return model.save();
  }

  /* static async update(user, id, alias) {
    const entityId = alias.entityId;
    if (!entityId) throw new DError("An entity ID is required!");
    const category = entityId.split("-")[0];
    const aliases = alias.aliases || [];
    // an array of case insensitive regexes of aliases
    const regexes = aliases.map(val => new RegExp(`^${_.escapeRegExp(val)}$`, "i"));
    const [a, b] = await Promise.all([
      AliasModel.findOne({ _id: id, tenant: user.tenant }),
      AliasModel.find({
        _id: { $ne: id },
        tenant: { $ne: user.tenant },
        $or: [
          { aliases: { $in: regexes }, entityId: new RegExp(`^${_.escapeRegExp(category)}`, "i") },
          { name: regexes, entityId: new RegExp(`^${_.escapeRegExp(category)}`, "i") },
        ],
      }),
    ]);
  }*/

  static async delete(user, id) {
    logger.info({ user }, `Removed alias ${id}.`);
    return AliasModel.findByIdAndRemove(id);
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
   * @param {string} filter
   * @returns {Promise<IAliasModel[]>}
   *
   * @memberOf Aliases
   */
  static async getByTenant(tenant, filter) {
    return (filter) ?
      AliasModel.find({ tenant, entityId: { $regex: new RegExp(`^${_.escapeRegExp(filter)}`, "i") } }) :
      AliasModel.find({ tenant });
  }

  static async getAll() {
    return AliasModel.find();
  }
}

module.exports = Aliases;
