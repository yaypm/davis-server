'use strict';

const _ = require('lodash'),
    logger = require('../utils/logger');

module.exports = function AccountService(users) {


    return {
        /**
         * Validates a user based on their device and request source
         * @param {string} deviceId - The ID that uniquely represence a device from a particular source.
         * @param {stirng} source - The source of the request (I.E. alexa, web, ect)
         * @returns {Object} [user=null] - The user object contains user specific configuration settings.
         */
        getUser(deviceId, source)  {
            let user = _.find(users, function (o) {
                    return _.includes(o[source], deviceId);
                }) || null;

            if (!_.isNull(user)) {
                logger.info('Found a valid user');
                logger.debug(`The merged user object is ${JSON.stringify(user)}`);
            } else {
                logger.warn(`Unable to find a valid user: ${user}`);
            }

            return user;
        }
    }
};