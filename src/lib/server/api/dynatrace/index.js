"use strict";

const dynatraceRoute = require("express").Router();

const aliases = require("./aliases");
const tenants = require("./tenants");

dynatraceRoute.use(aliases);
dynatraceRoute.use(tenants);

module.exports = dynatraceRoute;
