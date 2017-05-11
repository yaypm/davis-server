"use strict";

const _ = require("lodash");

const TenantModel = require("../models/tenant");
const UserController = require("./users");

const DError = require("../core/error");
const logger = require("../core/logger");

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

  static async update(user, id, tenant) {
    const t = await TenantModel.findById(id);

    const testOwner = t.owner.toString() !== user._id.toString();
    const testAdmins = _.filter(t.admins.map(admin => admin.toString() === user._id.toString())).length === 0;

    if (!t) {
      logger.info({ user }, `Unable to find a tenant with the ID ${id}.`);
      throw new DError("Unable to find a tenant with that ID!", 400);
    } else if (testOwner && testAdmins) {
      logger.warn({ user }, "Rejecting unauthorized tenant update.");
      throw new DError("You don't have the required permissions to update this tenant.", 403);
    }

    // Owners can't be modified.  This may change in the future!
    delete tenant.owner;
    _.assign(t, tenant);
    return t.save();
  }

  static async delete(user, id) {
    const t = await TenantModel.findById(id);

    if (!t) {
      logger.info({ user }, `Unable to find a tenant with the ID ${id}.`);
      throw new DError("Unable to find a tenant with that ID!", 400);
    } else if (t.owner !== user._id) {
      logger.warn({ user }, "Rejecting unauthorized tenant delete.");
      throw new DError("You don't have the required permissions to delete this tenant.", 403);
    }
    return t.remove();
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

  /**
   * Returns all the tenants available to the user
   *
   * @static
   * @param {any} user
   * @returns {Promise<[ITenantModel]>}
   *
   * @memberof Tenants
   */
  static async getAll(user) {
    return TenantModel.find({
      $or: [
        { owner: user._id },
        { admins: user._id },
        { users: user._id },
      ],
    });
  }
}

module.exports = Tenants;
