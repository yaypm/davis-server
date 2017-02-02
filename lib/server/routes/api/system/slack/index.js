'use strict';

const router = require('express').Router();

router.route('/start')
  .post((req, res) => {
    const davis = req.app.get('davis');
    const slack = davis.sources.slack;
    
    if (req.decoded.admin === false) {
      return res.send({ success: false, message: 'You must be an admin in order to create/edit/delete slack config.' });
    }

    slack.start(true)
      .then(() => {
        res.send({ success: true, message: 'Slack has been started.' });
      })
      .catch((err) => {
        res.send({ success: false, message: err.message });
      });
  });

router.route('/stop')
  .post((req, res) => {
    const davis = req.app.get('davis');
    const slack = davis.sources.slack;
    
    if (req.decoded.admin === false) {
      return res.send({ success: false, message: 'You must be an admin in order to create/edit/delete slack config.' });
    }

    slack.stop()
      .then(() => {
        res.send({ success: true, message: 'Slack has been shutdown.' });
      })
      .catch((err) => {
        res.send({ success: false, message: err.message });
      });
  });

router.route('/restart')
  .post((req, res) => {
    const davis = req.app.get('davis');
    const slack = davis.sources.slack;
    
    if (req.decoded.admin === false) {
      return res.send({ success: false, message: 'You must be an admin in order to create/edit/delete slack config.' });
    }

    slack.restart()
      .then(() => {
        res.send({ success: true, message: 'Slack has been restarted.' });
      })
      .catch((err) => {
        res.send({ success: false, message: err.message });
      });
  });

router.route('/delete')
  .post((req, res) => {
    const davis = req.app.get('davis');
    const slack = davis.sources.slack;
    
    if (req.decoded.admin === false) {
      return res.send({ success: false, message: 'You must be an admin in order to create/edit/delete slack config.' });
    }

    slack.delete()
      .then(() => {
        res.send({ success: true, message: 'Slack has deleted.' });
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

router.route('/users')
  .get((req, res) => {
    const davis = req.app.get('davis');
    res.send({ success: true, users: davis.sources.slack.getSlackUsers() });
  });

module.exports = router;
