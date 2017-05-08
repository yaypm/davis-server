"use strict";

const ProblemDetailModel = require("../models/problemDetail");

/**
 *
 * @class ProblemDetails
 */
class ProblemDetails {
  /**
   * Create new ProblemDetail
   *
   * @static
   * @param {IProblemDetail} spec
   * @returns {Promise<IProblemDetail>}
   *
   * @memberOf ProblemDetails
   */
  static async create(user, spec) {
    if (spec.id) {
      spec.pid = spec.id;
      delete spec.id;
    }
    spec.tenant = user.activeTenant.url;
    return ProblemDetailModel.create(spec);
  }

  /**
   * Get ProblemDetail by MongoID
   *
   * @static
   * @param {string} id
   * @returns {Promise<IProblemDetailModel>}
   *
   * @memberOf ProblemDetails
   */
  static async get(user, id) {
    return ProblemDetailModel.findOne({ tenant: user.activeTenant.url, pid: id });
  }

  /**
   * Get list of ProblemDetails by tenant ID
   *
   * @static
   * @param {string} tenant
   * @returns {Promise<IProblemDetailModel[]>}
   *
   * @memberOf ProblemDetails
   */
  static async getByTenant(tenant) {
    return ProblemDetailModel.find({ tenant });
  }

  static async getAll() {
    return ProblemDetailModel.find();
  }
}

module.exports = ProblemDetails;
