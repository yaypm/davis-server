'use strict';

const _ = require('lodash');
const router = require('express').Router();

router.route('/')
  // returns all the current configuration values
  .get((req, res) => {
    const davis = req.app.get('davis');
    const config = davis.config;

    config.getConfiguration()
      .then(c => {
        res.send({ success: true, config: c });
      })
      .catch(err => {
        res.send({ success: false, message: err.message });
      });
  });

router.route('/:category(dynatrace|slack|watson)')
  // returns a specific configuration based on the category
  .get((req, res) => {
    const davis = req.app.get('davis');
    const config = davis.config;
    const category = req.params.category;

    config.getConfiguration()
      .then(c => {
        const data = c[category];
        res.send({ success: true, [category]: data });
      })
      .catch(err => {
        res.send({ success: false, message: err.message });
      });
  })

  // updates the configuration based on the category
  .put((req, res) => {
    const davis = req.app.get('davis');
    const config = davis.config;
    const category = req.params.category;

    config.updateConfig({ [category]: req.body })
      .then(() => {
        res.send({ success: true, message: `${_.capitalize(category)} configuration successfully updated!` });
      })
      .catch(err => {
        res.send({ success: false, message: err.message });
      });
  });

// Enables Slack
router.route('/slack/start')
  .post((req, res) => {
    const davis = req.app.get('davis');
    const slack = davis.sources.slack;

    slack.start(true)
      .then(() => {
        res.send({ success: true, message: 'Slack has been started.' });
      })
      .catch(err => {
        res.send({ success: false, message: err.message });
      });
  });

// Returns the current Slack notification configuration
router.route('/slack/notifications')
  .get((req, res) => {
    const davis = req.app.get('davis');
    const config = davis.config;

    config.getConfiguration()
      .then(c => {
        const data = _.get(c, 'slack.notifications', {});
        res.send({ success: true, config: data });
      })
      .catch(err => {
        res.send({ success: false, message: err.message });
      });
  });

// Enables or disables slack notifications globally
router.route('/slack/notifications/:status(enable|disable)')
  .post((req, res) => {
    const davis = req.app.get('davis');
    const config = davis.config;
    const status = req.params.status;
    const statusObject = _.set({}, 'slack.notifications.enabled', (status === 'enable'));

    config.updateConfig(statusObject)
      .then(() => {
        res.send({ success: true, message: `Slack notifications have been successfully ${status}.` });
      })
      .catch(err => {
        res.send({ success: false, message: err.message });
      });
  });

router.route('/slack/notifications/rule')
  .post((req, res) => {
    const davis = req.app.get('davis');
    const config = davis.config;

    config.createSlackNotification(req.body)
      .then(() => {
        res.send({ success: true, message: 'Slack notification rule as been added.' });
      })
      .catch(err => {
        res.send({ success: false, message: err.message });
      });
  });

router.route('/slack/notifications/rule/:id')
  .get((req, res) => {
    const davis = req.app.get('davis');
    const config = davis.config;
    const id = req.params.id;

    config.getSlackNotification(id)
      .then(data => {
        res.send({ success: true, config: data });
      })
      .catch(err => {
        res.send({ success: false, message: err.message });
      });
  })

  .put((req, res) => {
    const davis = req.app.get('davis');
    const config = davis.config;
    const id = req.params.id;

    config.updateSlackNotification(id, req.body)
      .then(() => {
        res.send({ success: true, message: 'Slack notification rule as been updated.' });
      })
      .catch(err => {
        res.send({ success: false, message: err.message });
      });
  })

  .delete((req, res) => {
    const davis = req.app.get('davis');
    const config = davis.config;
    const id = req.params.id;

    config.deleteSlackNotification(id)
      .then(() => {
        res.send({ success: true, message: 'Slack notification rule as been removed.' });
      })
      .catch(err => {
        res.send({ success: false, message: err.message });
      });
  });

router.route('/mongodb/validate')
  // validates the MongoDB connection
  .get((req, res) => {
    const davis = req.app.get('davis');
    const service = davis.service;

    if (service.isConnectedToMongoDB()) {
      return res.send({ success: true, message: 'Successfully connected to MongoDB!' });
    }
    return res.send({ success: false, message: 'Unable to connect to MongoDB' });
  });

router.route('/dynatrace/validate')
  // validates the Dynatrace connection
  .get((req, res) => {
    const davis = req.app.get('davis');
    const dynatrace = davis.dynatrace;

    dynatrace.problemStatus()
      .then(() => {
        res.send({ success: true, message: 'Successfully contacted Dynatrace!' });
      })
      .catch(err => {
        res.send({ success: false, message: err.message });
      });
  });


module.exports = router;
