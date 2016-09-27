'use strict';

const _ = require('lodash'),
    logger = require('../utils/logger');

module.exports = function AccountService(users) {


    return {
        /**
         * Validates a user based on their device and request source
         * @param {string} deviceId - The ID that uniquely represents a device from a particular source.
         * @param {string} source - The source of the request (I.E. alexa, web, ect)
         * @returns {Object} [user=null] - The user object contains user specific configuration settings.
         */
        getUser(deviceId, source)  {
            let user = _.find(users, function (o) {
                return _.includes(o[source], deviceId);
            }) || null;

            if (!_.isNull(user)) {
                logger.debug('Found a valid user');
            } else {
                logger.warn(`Unable to find a valid user: ${deviceId}`);
            }

            return user;
        },
        
         /**
         * Validates a user based on their user id
         * @param {string} userId - The ID that uniquely represents a user.
         * @returns {Object} [user=null] - The user object contains user specific configuration settings.
         */
        getUserById(userId)  {
            let user = _.find(users, function (o) {
                return _.includes(o['id'], userId);
            }) || null;

            if (!_.isNull(user)) {
                logger.info('Found a valid user');
            } else {
                logger.warn(`Unable to find a valid user: ${userId}`);
            }

            return user;
        }
    };
};