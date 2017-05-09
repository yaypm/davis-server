// global modules
const Router = require("express").Router;
const Joi = require("joi");

// davis modules
const davis = require("../../core/davis");
const logger = require("../../core/logger");
const DError = require("../../core/error");

// routes
const auth = require("./auth");
const dynatrace = require("./dynatrace");
const system = require("./system");

const v1 = Router();

v1.use(auth);

v1.post("/ask", async (req, res, next) => {
  try {
    const schema = Joi.object().keys({ raw: Joi.string().min(1).required() });

    const validate = Joi.validate(req.body, schema);

    if (validate.error) {
      throw new DError(validate.error.details[0].message, 400);
    }

    const dreq = {
      raw: validate.value.raw,
      source: "web",
      user: req.user,
    };

    const dres = await davis.ask(dreq);
    res.json(dres);
  } catch (err) {
    next(err);
  }
});

v1.use("/system", system);
v1.use("/dynatrace", dynatrace);

// Global API 404
v1.use((req, res, next) => { next(new DError("Invalid route!", 404)); }); // eslint-disable-line no-unused-vars

// Global API Error Handler
v1.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
  const code = err.statusCode || 500;
  const message = (err.name === "DavisError") ? err.message : "An unhandled error occurred";

  if (err.name !== "DavisError") {
    logger.error({ err });
  } else {
    logger.debug(message);
  }
  res.status(code).json({ success: false, message });
});

module.exports.v1 = v1;
