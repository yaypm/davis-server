'use strict';

const account = require('../config/user'),
    _ = require('lodash'),
    logger = require('../utils/logger');

const AccountService = {
    /**
     * Validates a user based on their device and request source
     * @param {string} deviceId - The ID that uniquely represence a device from a particular source.
     * @param {stirng} source - The source of the request (I.E. alexa, web, ect)
     * @returns {Object} [user=null] - The user object contains user specific configuration settings.
     */
    getUser: (deviceId, source) => {
        let user = _.find(account.users, function(o) { return _.includes(o[source], deviceId);}) || null;

        if(!_.isNull(user)) {
            logger.info('Found a valid user');
            user = _.merge(user, _.omit(account, 'users'));
            logger.debug(`The merged user object is ${user}`);
        } else {
            logger.warn('Unable to find a valid user');
        }

        return user;
    }
};

module.exports = AccountService;