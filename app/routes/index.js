'use strict';

const router = require('express').Router();

/**
 * Loading in the routes
 */
router.use('/api/v1', require('./api'));
router.use('/alexa', require('../integrations/alexa/routes'));

/**
 * Loading additional intergrations
 */

// require('../intergrations/slack');

module.exports = router;