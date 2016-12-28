'use strict';

const router = require('express').Router();

router.get('/:type(tts|stt)/token', (req, res) => {
  const davis = req.app.get('davis');
  const logger = davis.logger;
  const service = davis.service;
  const type = req.params.type;

  logger.debug(`Received a ${type.toUpperCase()} token request.`);
  const tokenService = (type === 'tts') ? service.getTtsToken() : service.getSttToken();
  tokenService
    .then((token) => {
      res.send({ success: true, message: token });
    })
    .catch((err) => {
      res.send({ success: false, message: err.message });
    });
});

module.exports = router;
