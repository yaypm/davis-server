'use strict';

const router = require('express').Router(),
    problemService = require('../../../../services/events/problemService'),
    logger = require('../../../../utils/logger');

router.post('/', (req, res) => {
    problemService.saveProblem(req.body)
        .then(() => {
            logger.info('Saved a new problem event');
            res.sendStatus(202);
        })
        .catch(err => {
            let message;
            if (err.code === 11000) {
                message = 'This key already exists';
            } else {
                message = err.message;
            }
            logger.error(`Problem Event: ${JSON.message}`);
            res.status(400).send(message);
        });
});

module.exports = router;