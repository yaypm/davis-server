const moment = require("moment-timezone");
const TimeStamp = require("./time-stamp");

/**
 * Buildable time range object
 *
 * @class TimeRange
 */
class TimeRange {
  /**
   * Creates an instance of TimeRange.
   *
   * @param {(number | null | undefined)} start
   * @param {(number | null | undefined)} end
   * @param {string} timezone
   * @param {boolean} [compact=false]
   *
   * @memberOf TimeRange
   */
  constructor(start, end, timezone, compact = false) {
    this.timezone = timezone;
    this.compact = compact;
    this.start = new TimeStamp(start || -1, timezone, compact);
    this.end = new TimeStamp(end || -1, timezone, compact);
  }

  /**
   * Generate a slack representation
   *
   * @returns
   *
   * @memberOf TimeRange
   */
  slack() {
    return (this.start.valueOf === -1) ? "in the last few minutes" :
      (this.compact) ? this.compactSlack() : this.fullSlack();
  }

  /**
   * Generate a string representation
   *
   * @returns {String}
   *
   * @memberOf TimeRange
   */
  toString() {
    return (this.start.valueOf === -1) ? "in the last few minutes" :
      (this.compact) ? this.compactString() : this.fullString();
  }

  /**
   * Generate a compact slack version
   *
   * @private
   * @returns {String}
   *
   * @memberOf TimeRange
   */
  compactSlack() {
    return (this.end.valueOf > moment().valueOf()) ?
      `${this.start.slack()} - now` :
      `${this.start.slack()} - ${this.end.slack()}`;
  }

  /**
   * Generate a compact string version
   *
   * @private
   * @returns {String}
   *
   * @memberOf TimeRange
   */
  compactString() {
    return (this.end.valueOf > moment().valueOf()) ?
      `${this.start} - now` :
      `${this.start} - ${this.end}`;
  }

  /**
   * Generate a long slack version
   *
   * @private
   * @returns {String}
   *
   * @memberOf TimeRange
   */
  fullSlack() {
    return (this.end.valueOf > moment().valueOf()) ?
      `since ${this.start.slack()}` :
      `between ${this.start.slack()} and ${this.end.slack()}`;
  }

  /**
   *  Generate a long string version
   *
   * @private
   * @returns {String}
   *
   * @memberOf TimeRange
   */
  fullString() {
    return (this.end.valueOf > moment().valueOf()) ?
      `since ${this.start}` :
      `between ${this.start} and ${this.end}`;
  }
}

module.exports = TimeRange;
