'use strict';

const account = require('../config/user'),
    _ = require('lodash'),
    logger = require('../utils/logger');

const AccountService = {
    getUser: (deviceId, source) => {
        let user = _.find(account.users, function(o) { return _.includes(o[source], deviceId);}) || null;

        if(!_.isNull(user)) {
            logger.info('Found a valid user');
            user = _.merge(user, _.omit(account, 'users'));
            logger.debug(`The merged user object is ${user}`);
        }

        return user;
    }
};

module.exports = AccountService;