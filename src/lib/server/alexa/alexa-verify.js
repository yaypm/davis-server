"use strict";

const verifier = require("alexa-verifier");

const logger = require("../../core/logger");

const alexaMiddleware = (req, res, next) => {
  // if production and windows => fail 401
  if (process.env.NODE_ENV === "production" && process.platform === "win32") {
    logger.error("Cannot validate alexa requests on win32");
    req.status(401).json({ status: "failure", reason: "Cannot validate Alexa requests on Windows." });
    return;
  }

  // only validate requests with signaturecertchainurl header
  if (!req.headers.signaturecertchainurl) {
    next();
    return;
  }

  // do not verify alexa requests in development
  if (process.env.NODE_ENV !== "production") {
    logger.debug("Alexa verification skipped outside production");
    req.alexaVerified = true;
    next();
    return;
  }

  req._body = true;
  req.rawBody = "";
  req.on("data", (data) => {
    req.rawBody += data;
    return req.rawBody;
  });
  req.on("end", () => {
    try {
      req.body = JSON.parse(req.rawBody);
    } catch (error) {
      logger.error(error);
      req.body = {};
    }
    const certUrl = req.headers.signaturecertchainurl;
    const signature = req.headers.signature;
    const requestBody = req.rawBody;
    verifier(certUrl, signature, requestBody, (err) => {
      if (err) {
        logger.error(err, "error validating the alexa cert.");
        res.status(401).json({ status: "failure", reason: err });
      } else {
        req.alexaVerified = true;
        next();
      }
    });
  });
};

module.exports = alexaMiddleware;
