"use strict";

const tenantRoute = require("express").Router();

const TenantController = require("../../../controllers/tenant");

tenantRoute.route("/tenant")
  .get(async (req, res, next) => {
    try {
      // TODO remove sensitive data from non-admin view
      return res.json({ success: true, tenant: req.user.tenant });
    } catch (err) {
      return next(err);
    }
  })
  .post(async (req, res, next) => {
    try {
      const tenant = req.body;
      await TenantController.create(req.user, tenant);
      return res.json({ success: true, message: "Tenant successfully added!" });
    } catch (err) {
      return next(err);
    }
  });

module.exports = tenantRoute;
