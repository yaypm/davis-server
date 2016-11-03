'use strict';

const router = require('express').Router();

router.use('/alexa', require('./alexa'));
router.use('/api/v1', require('./api'));

module.exports = router;
