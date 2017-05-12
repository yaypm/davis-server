const moment = require("moment-timezone");

/**
 * This is a workaround for lex timezone handling. Lex always parses relative dates from the
 * eastern timezone. This parser should be used when a user uses a relative
 * date like "yesterday" or "today".
 *
 * @param {string} date
 * @param {IUserModel} user
 * @param {string} raw
 * @returns {string}
 */
function relativeDate(date, user, raw) {
  if (date && /yesterday|today|tomorrow/i.test(raw)) {
    return moment.tz(date, "US/Eastern").tz(user.timezone).format("YYYY-MM-DD");
  }
  return date;
}

/**
 * This is a workaround for lex date/app handling. If you asked what happened to madison island
 * yesterday, the bot will recognize the app as "madison island yesterday" and will not recognize
 * a date. This should be called when there is an app, but no date.
 *
 * @param {string} app
 * @param {string} date
 * @param {IUserModel} user
 * @returns {string}
*/
function appDate(app, date, user) {
  let newDate;
  let newApp;

  if (/yesterday$/i.test(app)) {
    newDate = moment.tz(user.timezone).subtract(1, "day").format("YYYY-MM-DD");
    newApp = app.replace(/yesterday$/i, "");
  } else if (/today$/i.test(app)) {
    newDate = moment.tz(user.timezone).format("YYYY-MM-DD");
    newApp = app.replace(/today$/i, "");
  } else if (/tomorrow$/i.test(app)) {
    newDate = moment.tz(user.timezone).add(1, "day").format("YYYY-MM-DD");
    newApp = app.replace(/tomorrow$/i, "");
  } else {
    newDate = date;
    newApp = app;
  }
  return { date: newDate, app: newApp };
}

/**
 * This is a parser that turns a day of the week like "thursday" into a date like 2017-04-23
 *
 * @param {string} dayOfWeek
 * @param {IUserModel} user
 * @returns {string}
 */
function dow(dayOfWeek, user) {
  const date = moment.tz(user.timezone).day(dayOfWeek);
  if (date.isAfter(moment())) {
    return date.subtract(1, "week").format("YYYY-MM-DD");
  }
  return date.format("YYYY-MM-DD");
}

module.exports = {
  relativeDate,
  appDate,
  dow,
};
