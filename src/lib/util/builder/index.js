"use strict";

const CardBuilder = require("./card-builder");
const StringBuilder = require("./string-builder");
const TimeRange = require("./time-range");
const TimeStamp = require("./time-stamp");
const Field = require("./field");

/**
 *
 *
 * @export
 * @param {IUserModel} user
 * @returns
 */
function sb(user) {
  return new StringBuilder(user);
}

/**
 *
 *
 * @export
 * @param {IUserModel} user
 * @returns
 */
function cb(user) {
  return new CardBuilder(user);
}

module.exports = {
  cb,
  sb,
  TimeRange,
  TimeStamp,
  Field,
};
