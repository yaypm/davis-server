'use strict';

const router = require('express').Router(),
    watson = require('./watson'),
    events = require('./events'),
    system = require('./system'),
    logger = require('../../utils/logger');
    // version = require('../../utils/version');

// middleware to use for all requests
router.use((req, res, next) => {
    logger.info('Processing an API request');
    next();
});

router.get('/git', function(req, res) {
    logger.info('Received a request for Git info!');
    res.json({});
    // res.json({branch: version.branch, tag: version.tag, lastUpdate: version.lastUpdate });
});

router.use('/watson', watson);
router.use('/events', events);
router.use('/system', system);

module.exports = router;