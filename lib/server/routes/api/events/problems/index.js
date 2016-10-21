'use strict';

const router = require('express').Router();

router.post('/', (req, res) => {
  const davis = req.app.get('davis');
  const logger = davis.logger;
  const service = davis.service;
  service.saveProblem(req.body)
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
  res.send({
    msg: 'Add the following to the web hook configuration.',
    config: '{ "PID":"{PID}", "ProblemID":"{ProblemID}", "State":"{State}", "ProblemImpact":"{ProblemImpact}", "ProblemURL":"{ProblemURL}", "ImpactedEntity":"{ImpactedEntity}", "Tags":"{Tags}" }',
  });
});

module.exports = router;
