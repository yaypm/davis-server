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
    // Commented out for now, there's an uncaught exception about an unexpected number when calling git.log()
    // git.log( gitLog => {
        
        let lastUpdate;
        
        // if (gitLog[0][2]) {
        //     lastUpdate = gitLog[0][2];
            
        // }
        
        git.branch( branch => {
            git.tag( tag => {
                res.json({branch: branch, tag: tag, lastUpdate: lastUpdate });
            });
        });
    // });
});

router.use('/watson', watson);

module.exports = router;