"use strict";

/*
 * Module dependencies
 */
const BbPromise = require("bluebird");
const json = require("body-parser").json;
const connectMongo = require("connect-mongo");
const dotenv = require("dotenv");
const express = require("express");
const session = require("express-session");
const mongoose = require("mongoose");
const passport = require("passport");
const randtoken = require("rand-token");

const MongoStore = connectMongo(session);
global.Promise = BbPromise;
mongoose.Promise = BbPromise;
dotenv.config();

/*
 * Davis dependencies
 */

const alexaVerification = require("./lib/server/alexa-verify");
const logger = require("./lib/core/logger");
const api = require("./lib/server/api");

/*
 * Startup logic
 */

const mongoString = process.env.DAVIS_MONGODB || "mongodb://localhost/davis-ng";

logger.debug("Connecting to mongodb: ", mongoString);
mongoose.connect(mongoString)
  .then(() => {
    const app = express();

    /*
    * express middlewares
    */
    logger.debug("Setting up express");
    app.use(alexaVerification);
    app.use(json());
    app.use(session({
      resave: true,
      saveUninitialized: true,
      secret: process.env.DAVIS_SECRET,
      store: new MongoStore({ mongooseConnection: mongoose.connection }),
    }));
    app.use(passport.initialize());
    app.use(passport.session());

    app.use((req, res, next) => {
      req.req_id = randtoken.generate(16);
      logger.debug({ req, body: req.body });
      next();
    });

    app.use("/api/v1", api.v1);

    const port = process.env.DAVIS_PORT || 8080;
    app.listen(port);
    logger.debug(`Listening on http://0.0.0.0:${port}/`);
  })
  .catch((err) => {
    logger.error(err);
    process.exit(1);
  });
