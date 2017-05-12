"use strict";

const aliasRoute = require("express").Router();

const Aliases = require("../../../controllers/aliases");
const Dynatrace = require("../../../core/dynatrace");


aliasRoute.route("/aliases")
  .get(async (req, res, next) => {
    try {
      const {
        applications,
        services,
        hosts,
        processGroups,
      } = await Dynatrace.getAllEntities(req.user);

      return res.json({ success: true, applications, services, hosts, processGroups });
    } catch (err) {
      return next(err);
    }
  })
  .post(async (req, res, next) => {
    try {
      const alias = await Aliases.create(req.user, {
        entityId: req.body.entityId,
        aliases: req.body.aliases,
        display: {
          audible: req.body.audible,
          visual: req.body.visual,
        },
      });
      return res.status(201).json({
        id: alias._id,
        message: "Successfully added a new alias.",
        success: true,
      });
    } catch (err) {
      return next(err);
    }
  });

aliasRoute.route("/aliases/:id(([0-9a-f]{24}))")
  .put(async (req, res, next) => {
    try {
      await Aliases.update(req.user, req.params.id, req.body);
      return res.json({ success: true, message: "Successfully updated the alias." });
    } catch (err) {
      return next(err);
    }
  })
  .delete(async (req, res, next) => {
    try {
      await Aliases.delete(req.user, req.params.id);
      return res.json({ success: true, message: "Successfully removed the alias." });
    } catch (err) {
      return next(err);
    }
  });

aliasRoute.route("/aliases/:type(applications|services|hosts|process-groups)")
  .get(async (req, res, next) => {
    const type = req.params.type.toLowerCase();
    try {
      const aliases = (type === "applications") ? await Dynatrace.getApplications(req.user)
        : (type === "services") ? await Dynatrace.getServices(req.user)
        : (type === "hosts") ? await Dynatrace.getHosts(req.user)
        : (type === "process-groups") ? await Dynatrace.getProcessGroups(req.user)
        : (function () { throw new Error(`Invalid alias type '${type}'.`); }());

      return res.json({ success: true, [type]: aliases });
    } catch (err) {
      return next(err);
    }
  });

module.exports = aliasRoute;
