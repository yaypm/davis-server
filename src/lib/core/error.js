"use strict";

const logger = require("../core/logger");

class DavisError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.name = this.constructor.name;
    this.message = message;
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }

  /**
   * Handles a number of potential mongo errors
   *
   * @static
   * @param {any} err
   * @param {any} res
   * @param {any} next
   *
   * @memberof DavisError
   */
  static handleMongoError(err, res, next) {
    if (err.name === "MongoError" && err.code === 11000) {
      next(new DavisError("This item has already been created!", 400));
    } else if (err.name === "ValidationError") {
      const invalidDataMessage = (err.errors) ? Object.values(err.errors)[0].message : "Invalid data!";
      next(new DavisError(invalidDataMessage, 400));
    } else if (err instanceof Error) {
      logger.error(err, "An unhandled Mongo error occurred.");
      next(err);
    } else {
      next();
    }
  }
}

module.exports = DavisError;
