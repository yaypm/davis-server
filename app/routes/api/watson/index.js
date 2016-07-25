'use strict';

const router = require('express').Router(),
    WatsonService = require('../../../services/WatsonService'),
    logger = require('../../../utils/logger');



router.get('/tts/token', (req, res) => {
    logger.debug('Received a TTS token request');
    WatsonService(req.app.get('davisConfig')).getTtsToken()
        .then(token => {
            res.send(token);
        })
        .catch(err => {
            logger.error(`Unable to get tts token: ${err}`);
            res.status(500).send('Unable to get token');
        });
});

router.get('/stt/token', (req, res) => {
    logger.debug('Received a STT token request');
    WatsonService(req.app.get('davisConfig')).getSttToken()
        .then(token => {
            res.send(token);
        })
        .catch(err => {
            logger.error(`Unable to get stt token: ${err}`);
            res.status(500).send('Unable to get token');
        });
});

module.exports = router;