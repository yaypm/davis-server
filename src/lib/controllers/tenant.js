"use strict";

const _ = require("lodash");

const TenantModel = require("../models/tenant");
const UserController = require("./users");

/**
 *
 * @class Tenant
 */
class Tenants {
  /**
   * Create new Tenant
   *
   * @static
   * @param {ITenant} spec
   * @returns {Promise}
   *
   * @memberOf Tenants
   */
  static async create(user, tenant) {
    const t = _.assign(tenant, { owner: user._id });
    const tenantModel = new TenantModel(t);
    const result = await tenantModel.save();
    await UserController.setCurrentTenant(user._id, result._id);
    return result;
  }

  /**
   * Get Alias by MongoID
   *
   * @static
   * @param {string} id
   * @returns {Promise<ITenantModel>}
   *
   * @memberOf Tenants
   */
  static async getById(id) {
    return TenantModel.findById(id);
  }

  static async getAll() {
    return TenantModel.find();
  }
}

module.exports = Tenants;
