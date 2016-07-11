'use strict';

const router = require('express').Router(),
    watson = require('./watson'),
    logger = require('../../utils/logger');

// middleware to use for all requests
router.use((req, res, next) => {
    logger.info('Processing an API request');
    next();
});

router.use('/watson', watson);

module.exports = router;