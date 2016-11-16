'use strict';

const router = require('express').Router();

router.post('/:token', (req, res) => {
  const davis = req.app.get('davis');
  if (davis.config.getApiEventsToken() !== req.params.token) return res.status(401);
  const logger = davis.logger;
  const service = davis.service;
  return service.saveProblem(req.body)
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
      logger.error(`Problem Event: ${message}`);
      res.status(400).send(message);
    });
});

router.get('/', (req, res) => {
  const davis = req.app.get('davis');
  const token = davis.config.getApiEventsToken();
  return res.send({
    msg: 'Add the following to the web hook configuration.',
    uri: `/api/v1/events/problems/${token}/`,
    config: '{ "PID":"{PID}", "ProblemID":"{ProblemID}", "State":"{State}", "ProblemImpact":"{ProblemImpact}", "ProblemURL":"{ProblemURL}", "ImpactedEntity":"{ImpactedEntity}", "Tags":"{Tags}" }',
  });
});

module.exports = router;
