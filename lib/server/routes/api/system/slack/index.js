'use strict';

const _ = require('lodash');
const router = require('express').Router();

// Enables Slack
router.route('/start')
  .post((req, res) => {
    const davis = req.app.get('davis');
    const slack = davis.sources.slack;

    slack.start(true)
      .then(() => {
        res.send({ success: true, message: 'Slack has been started.' });
      })
      .catch((err) => {
        res.send({ success: false, message: err.message });
      });
  });

router.route('/currentChannels')
  .get((req, res) => {
    const davis = req.app.get('davis');
    res.send({ success: true, channels: davis.sources.slack.getDavisChannels() });
  });

module.exports = router;
