'use strict';

const express = require('express'),
    router = express.Router(),
    AlexaService = require('../services/AlexaService'),
    logger = require('../../../utils/logger');

router.post('/', function(req, res) {
    logger.info('Received a request from Alexa!');

    AlexaService(req.app.get('davisConfig')).askDavis(req)
        .then(response => {
            logger.info('Sending a response back to the Alexa service');
            res.json(response);
        })
        .catch(err => {
            //ToDo add an error response.
            logger.error('Unable to respond to the request received from Alexa');
            logger.error(err);
            res.end();
        });
});

module.exports  = router;