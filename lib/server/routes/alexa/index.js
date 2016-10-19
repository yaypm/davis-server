'use strict';

const router = require('express').Router();  // eslint-disable-line new-cap

router.post('/', (req, res) => {
  const { logger, service } = req.app.get('davis');
  logger.info('Received a request from Alexa!');
  AlexaService(req.app.get('davisConfig')).askDavis(req)
    .then(response => {
      res.json(response);
    })
    .catch(err => {
      logger.error('Unable to respond to the request received from Alexa');
      res.json(err);
    });
});
