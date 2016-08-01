'use strict';

const express = require('express'),
    router = express.Router(),
    AlexaService = require('../services/AlexaService'),
    logger = require('../../../utils/logger');

router.post('/', function(req, res) {
    logger.info('Received a request from Alexa!');

    AlexaService(req.app.get('davisConfig')).askDavis(req)
        .then(response => {
            res.json(response);
        })
        .catch(err => {
            //ToDo add an error response.
            logger.error('Unable to respond to the request received from Alexa');
            res.json(err);
        });
});

module.exports  = router;