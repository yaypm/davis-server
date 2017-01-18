'use strict';

const router = require('express').Router();

const authenticate = require('../../../auth');

router.post('/:token', (req, res) => {
  const davis = req.app.get('davis');
  // Ensures a valid token is used
  if (davis.config.getApiEventsToken() !== req.params.token) return res.status(401);

  const logger = davis.logger;
  return davis.notifications.dynatraceProblem(req.body)
    .then(() => {
      logger.info(`Processed a notification for event for ${req.body.PID}`);
      res.sendStatus(202);
    })
    .catch((err) => {
      logger.error(`Problem Event: ${err.message}`);
      res.sendStatus(400);
    });
});

// Validates that the user is authenticated.
router.use(authenticate.verifyToken);

router.get('/', (req, res) => {
  const davis = req.app.get('davis');
  const token = davis.config.getApiEventsToken();

  if (req.decoded.admin === false) {
    return res.send({ success: false, message: 'You must be an admin in order to see other users information.' });
  }

  return res.send({
    msg: 'Add the following to the web hook configuration.',
    uri: `/api/v1/events/problems/${token}/`,
    config: '{ "PID":"{PID}", "ProblemID":"{ProblemID}" }',
  });
});

module.exports = router;
