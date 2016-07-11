'use strict';

const router = require('express').Router();

/**
 * Loading in the routes
 */
router.use('/api/v1', require('./api'));
router.use('/alexa', require('../intergrations/alexa/routes'));

module.exports = router;