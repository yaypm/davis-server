const moment = require("moment-timezone");

const formats = {
  lastDay: "[yesterday at] LT",
  lastWeek: "[last] dddd [at] LT",
  nextDay: "[tomorrow at] LT",
  nextWeek: "dddd [at] LT",
  sameDay: "[today at] LT",
  sameElse: "L [at] LT",
};

class TimeStamp {
  /**
   * Creates an instance of TimeStamp.
   *
   * @param {number} valueOf
   * @param {string} timezone
   * @param {boolean} [compact=false]
   *
   * @memberOf TimeStamp
   */
  constructor(valueOf, timezone, compact = false) {
    this.valueOf = valueOf;
    this.timezone = timezone;
    this.compact = compact;
  }

  /**
   * Get unix timestamp
   *
   * @readonly
   *
   * @memberOf TimeStamp
   */
  get unix() {
    return Math.floor(this.valueOf / 1000);
  }

  /**
   * Generate string representation
   *
   * @returns
   *
   * @memberOf TimeStamp
   */
  toString() {
    return (this.valueOf === -1) ? "now" :
      moment.tz(this.valueOf, this.timezone).calendar(undefined, formats);
  }

  /**
   * Generate slack representation
   *
   * @returns
   *
   * @memberOf TimeStamp
   */
  slack() {
    return (this.valueOf === -1) ? "now" :
      (this.compact) ?
        `<!date^${this.unix}^{date_short_pretty} {time}|${this}>` :
        `<!date^${this.unix}^{date_long_pretty} at {time}|${this}>`;
  }
}

module.exports = TimeStamp;
