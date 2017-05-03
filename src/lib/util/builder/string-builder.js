"use strict";

const moment = require("moment");
const Aliases = require("../../controllers/aliases");
const Util = require("../../util");
const Entity = require("./entity");
const helpers = require("./helpers");
const TimeRange = require("./time-range");
const TimeStamp = require("./time-stamp");
const _ = require("lodash");
const string = require("string");

/**
 * String Builder
 *
 * @class StringBuilder
 */
class StringBuilder {
  /**
   * Creates an instance of StringBuilder.
   *
   * @param {IUserModel} user
   *
   * @memberOf StringBuilder
   */
  constructor(user) {
    this.user = user;
    this.state = [];
    this.entitiesRunning = false;
    this.aliases = Promise.resolve([]);
  }

  /**
   *    * Add an entity
   *
   * @param {string} entityId
   * @param {string} fallback
   * @returns
   *
   * @memberOf StringBuilder
   */
  e(entityId, fallback) {
    if (!this.entitiesRunning) {
      this.aliases = Aliases.getByTenant(this.user.activeTenant.url);
    }
    this.entitiesRunning = true;
    this.state.push(this.aliases.then((aliases) => {
      const alias = _.find(aliases, { entityId });
      if (!alias) { return new Entity(null, fallback); }
      return new Entity(alias, fallback);
    }));
    return this;
  }

  /**
   *    * Add an entity
   *
   * @param {string} entityId
   * @param {string} fallback
   * @returns
   *
   * @memberOf StringBuilder
   */
  entity(entityId, fallback) {
    return this.e(entityId, fallback);
  }

  /**
   *    * Add a time stamp
   *
   * @param {number} val
   * @param {boolean} [compact]
   * @returns
   *
   * @memberOf StringBuilder
   */
  ts(val, compact) {
    this.state.push(Promise.resolve(new TimeStamp(val, this.user.timezone, compact)));
    return this;
  }

  /**
   *    * Add a time stamp
   *
   * @param {number} val
   * @param {boolean} [compact]
   * @returns
   *
   * @memberOf StringBuilder
   */
  tstamp(val, compact) {
    return this.ts(val, compact);
  }

  /**
   *    * Add a time range
   *
   * @param {number} start
   * @param {number} end
   * @param {boolean} [compact]
   * @returns
   *
   * @memberOf StringBuilder
   */
  tr(start, end, compact) {
    this.state.push(Promise.resolve(new TimeRange(start, end, this.user.timezone, compact)));
    return this;
  }

  /**
   *    * Add a time range
   *
   * @param {number} start
   * @param {number} end
   * @param {boolean} [compact]
   * @returns
   *
   * @memberOf StringBuilder
   */
  trange(start, end, compact) {
    return this.tr(start, end, compact);
  }

  /**
   *    * Push a stringable or slackable object
   *
   * @param {IBuildable} item
   * @returns
   *
   * @memberOf StringBuilder
   */
  s(item) {
    this.state.push(Promise.resolve(item));
    return this;
  }

  /**
   *    * Push a stringable or slackable object
   *
   * @param {IBuildable} item
   * @returns
   *
   * @memberOf StringBuilder
   */
  stringable(item) {
    return this.s(item);
  }

  /**
   *    * Add a humanized string object
   *
   * @param {IBuildable} item
   * @returns
   *
   * @memberOf StringBuilder
   */
  h(item) {
    return this.s(string(item).humanize().s.toLowerCase());
  }

  /**
   *    * Add a humanized string object
   *
   * @param {IBuildable} item
   * @returns
   *
   * @memberOf StringBuilder
   */
  humanize(item) {
    return this.h(item);
  }

  /**
   *    * Add a duration
   *
   * @param {string} range
   * @returns
   *
   * @memberOf StringBuilder
   */
  d(range) {
    this.state.push(Promise.resolve(Util.Date.preciseDiff(moment(), moment().subtract(moment.duration(range)))));
    return this;
  }

  /**
   *    * Add a duration
   *
   * @param {string} range
   * @returns
   *
   * @memberOf StringBuilder
   */
  duration(range) {
    return this.d(range);
  }

  /**
   *    * Add a period
   *
   * @readonly
   *
   * @memberOf StringBuilder
   */
  get p() {
    this.state.push(Promise.resolve("."));
    return this;
  }

  /**
   *    * Add a period
   *
   * @readonly
   *
   * @memberOf StringBuilder
   */
  get period() {
    return this.p;
  }

  /**
   *    * Add a comma
   *
   * @readonly
   *
   * @memberOf StringBuilder
   */
  get c() {
    this.state.push(Promise.resolve(","));
    return this;
  }

  /**
   *    * Add a comma
   *
   * @readonly
   *
   * @memberOf StringBuilder
   */
  get comma() {
    return this.c;
  }

  /**
   *    * Add a question mark
   *
   * @readonly
   *
   * @memberOf StringBuilder
   */
  get q() {
    this.state.push(Promise.resolve("?"));
    return this;
  }

  /**
   *    * Add a question mark
   *
   * @readonly
   *
   * @memberOf StringBuilder
   */
  get question() {
    return this.q;
  }

  /**
   *    * Add a newline
   *
   * @readonly
   *
   * @memberOf StringBuilder
   */
  get n() {
    this.state.push(Promise.resolve("\n"));
    return this;
  }

  /**
   *    * Add a newline
   *
   * @readonly
   *
   * @memberOf StringBuilder
   */
  get newline() {
    return this.n;
  }

  /**
   * Generate a string representation
   *
   * @returns {Promise<string>}
   *
   * @memberOf StringBuilder
   */
  async toString() {
    return helpers.stringify(this.state);
  }

  /**
   * Generate an audible representation
   *
   * @returns {Promise<string>}
   *
   * @memberOf StringBuilder
   */
  async audible() {
    return helpers.audible(this.state);
  }

  /**
   * Generate a slack representation
   *
   * @returns {Promise<string>}
   *
   * @memberOf StringBuilder
   */
  async slack() {
    return helpers.slackify(this.state);
  }
}

module.exports = StringBuilder;
