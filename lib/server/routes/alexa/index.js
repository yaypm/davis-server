'use strict';

const router = require('express').Router();  // eslint-disable-line new-cap

router.post('/', (req, res) => {
  const davis = req.app.get('davis');
  const logger = davis.logger;
  const alexa = davis.sources.alexa;

  logger.info('Received a request from Alexa!');
  alexa.askDavis(req).then((response) => res.json(response));
});

module.exports = router;
