const Router = require("express").Router;
const Dynatrace = require("../../../core/dynatrace");
const logger = require("../../../core/logger");

const dynatrace = Router();

dynatrace.get("/aliases", async (req, res) => {
  try {
    const {
      applications,
      services,
      hosts,
      processGroups,
    } = await Dynatrace.getAllEntities(req.user);

    res.json({ success: true, applications, services, hosts, processGroups });
  } catch (err) {
    logger.error(err);
    res.status(500).json({ success: false, message: "Unable to get aliases." });
  }
});

dynatrace.get("/aliases/applications", async (req, res) => {
  try {
    const applications = await Dynatrace.getApplications(req.user);
    res.json({ success: true, applications });
  } catch (err) {
    logger.error(err);
    res.status(500).json({ success: false, message: "Unable to get a list applications." });
  }
});

dynatrace.get("/aliases/services", async (req, res) => {
  try {
    const services = await Dynatrace.getServices(req.user);
    res.json({ success: true, services });
  } catch (err) {
    logger.error(err);
    res.status(500).json({ success: false, message: "Unable to get a list services." });
  }
});

dynatrace.get("/aliases/hosts", async (req, res) => {
  try {
    const hosts = await Dynatrace.getHosts(req.user);
    res.json({ success: true, hosts });
  } catch (err) {
    logger.error(err);
    res.status(500).json({ success: false, message: "Unable to get a list hosts." });
  }
});

dynatrace.get("/aliases/process-group", async (req, res) => {
  try {
    const processGroups = await Dynatrace.getProcessGroups(req.user);
    res.json({ success: true, processGroups });
  } catch (err) {
    logger.error(err);
    res.status(500).json({ success: false, message: "Unable to get a list process groups." });
  }
});

module.exports = dynatrace;
