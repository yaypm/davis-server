'use strict';

const express = require('express'),
    router = express.Router(),
    WebService = require('../services/WebService'),
    logger = require('../../../utils/logger');

router.post('/', function(req, res) {
    logger.info('Received a request from web!');

    WebService(req.app.get('davisConfig')).askDavis(req)
        .then(response => {
            logger.info('Sending a response back to the web service');
            res.json(response);
        })
        .catch(err => {
            //ToDo add an error response.
            logger.error('Unable to respond to the request received from web');
            logger.error(err);
            res.end();
        });
});

router.get('/token', function(req, res) {
    logger.info('Received a request from web for token!');

    WebService(req.app.get('davisConfig')).getDavisUserToken(req)
        .then(response => {
            logger.info('Sending a response back to the web service');
            res.send(response);
        })
        .catch(err => {
            //ToDo add an error response.
            logger.error('Unable to respond to the request received from web');
            logger.error(err);
            res.end();
        });
});

module.exports  = router;