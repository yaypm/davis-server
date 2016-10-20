'use strict';

const router = require('express').Router();

router.get('/:type(tts|stt)/token', (req, res) => {
  const { logger, service } = req.app.get('davis');
  const type = req.params.type;

  logger.debug(`Received a ${type.toUpperCase()} token request.`);
  const tokenService = (type === 'tts') ? service.getTtsToken() : service.getSttToken();
  tokenService
    .then(token => {
      res.send(token);
    })
    .catch(err => {
      logger.error(`Unable to get ${type.toUpperCase()} token: ${err}`);
      const code = err.code || 500;
      res.status(code).send(err.message);
    });
});

module.exports = router;
