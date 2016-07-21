'use strict';

const router = require('express').Router(),
    config = require('config');

/**
 * Loading in the routes
 */
router.use('/api/v1', require('./api'));
router.use('/alexa', require('../intergrations/alexa/routes'));

/**
 * Loading additional intergrations
 */

require('../intergrations/slack');

module.exports = router;