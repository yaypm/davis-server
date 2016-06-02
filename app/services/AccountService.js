'use strict';

var account = require('../config/account.json'),
    _ = require('lodash');

module.exports.getUser = function getUser(deviceId, source) {
    //ToDo return defaults if missing from the user
    return _.find(account.users, function(o) { return _.includes(o[source], deviceId) }) || null;
};