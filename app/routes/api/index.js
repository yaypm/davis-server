'use strict';

const router = require('express').Router(),
    watson = require('./watson'),
    git = require('git-rev'),
    logger = require('../../utils/logger');

// middleware to use for all requests
router.use((req, res, next) => {
    logger.info('Processing an API request');
    next();
});

router.get('/git', function(req, res) {
    logger.info('Received a request for Git info!');
        
    let branch, tag, lastUpdate;

    git.getBranch()
    .then( result => {
        branch = result;
        return git.getTag();
    })
    .then( result => {
        tag = result;
        return git.getLastCommitDate();
    })
    .then( result => {
        lastUpdate = result;
        res.json({branch: branch, tag: tag, lastUpdate: lastUpdate });
    })
    .catch(err => {
        //ToDo
        logger.error('Unable to respond to get Git info');
        logger.error(err.message);
        res.end();
    });
    
});

router.use('/watson', watson);

module.exports = router;