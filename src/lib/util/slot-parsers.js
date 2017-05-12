const moment = require("moment-timezone");

module.exports.relativeDate = function (date, user, raw) {
  if (date && /yesterday|today|tomorrow/i.test(raw)) {
    return moment.tz(date, "US/Eastern").tz(user.timezone).format("YYYY-MM-DD");
  }
  return date;
};

module.exports.appDate = function (app, date, user) {
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
};

module.exports.dow = function (dow, user) {
  const date = moment.tz(user.timezone).day(dow);
  if (date.isAfter(moment())) {
    return date.subtract(1, "week").format("YYYY-MM-DD");
  }
  return date.format("YYYY-MM-DD");
};
