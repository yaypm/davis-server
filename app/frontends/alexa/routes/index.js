'use strict';

const express = require('express'),
    router = express.Router(),
    AlexaService = require('../services/AlexaService'),
    logger = require('../../../utils/logger');


router.post('/', function(req, res) {
    logger.info('Recieved a request from Alexa!');

    //ToDo: Check that the request is from Amazon
    AlexaService.askDavis(req)
    .then(() => {
        res.json({msg: 'we got dater!'});
    });
    //res.json({type: AlexaService.getRequestType(req.body)}) ;
});

module.exports  = router;