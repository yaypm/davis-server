"use strict";

const Router = require("express").Router;

const logger = require("../../core/logger");
const DError = require("../../core/error");

const alexa = Router();

alexa.post("/", async (req, res, next) => {
  try {
    if (!req.alexaVerified && !process.env.MANAGED && process.env.NODE_ENV === "production") {
      logger.error("Received an unauthentic Alexa request");
      throw new DError("Not an authentic Alexa request", 401);
    }
    // TODO add support for Alexa
    return res.status(200).json({ message: "It worked... kind of!" });
  } catch (err) {
    return next(err);
  }
});

module.exports = alexa;
