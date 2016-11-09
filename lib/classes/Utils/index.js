'use strict';

const fse = require('fs-extra');
const error = require('./Error');
const Logger = require('./Logger');
const Events = require('./Events');
const moment = require('moment');
const _ = require('lodash');

module.exports.fileExistsSync = function (filePath) {
  try {
    const stats = fse.lstatSync(filePath);
    return stats.isFile();
  } catch (e) {
    return false;
  }
};

module.exports.readFileSync = function (filePath) {
  let content;

  content = fse.readFileSync(filePath);

  if (filePath.endsWith('.json')) {
    content = JSON.parse(content);
  } else {
    content = content.toString().trim();
  }

  return content;
};

module.exports.getTense = function (exchange) {
  const timeRange = exchange.getTimeRange();
  const now = moment();

  if (now.isBefore(timeRange.startTime)) {
    return 'future';
  } else if (timeRange.stopTime.isBefore(now)) {
    return 'past';
  }
  return 'present';
};

module.exports.DError = error.DError;
module.exports.logError = error.logError;
module.exports.Logger = Logger;
module.exports.Events = Events;
