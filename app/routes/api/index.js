'use strict';

const router = require('express').Router(),
    git = require('git-rev'),
    watson = require('./watson'),
    logger = require('../../utils/logger');

// middleware to use for all requests
router.use((req, res, next) => {
    logger.info('Processing an API request');
    next();
});

router.get('/git', function(req, res) {
    logger.info('Received a request for Git info!');
    git.branch( branch => {
        git.tag( tag => {
            if (branch !== 'master') {
                res.send(tag + ' (' +  branch + ')');
            } else {
                res.send(tag);
            }
        });
    })
});

router.use('/watson', watson);

module.exports = router;