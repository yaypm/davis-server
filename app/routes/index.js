'use strict';

const router = require('express').Router();

/**
 * Loading in the routes
 */
router.use('/api/v1', require('./api'));
router.use('/alexa', require('../integrations/alexa/routes'));
router.use('/web', require('../integrations/web/routes'));

module.exports = router;