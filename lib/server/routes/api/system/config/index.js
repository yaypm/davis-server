'use strict';

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

router.route('/dynatrace')
  // returns the dynatrace configuration
  .get((req, res) => {
    const davis = req.app.get('davis');
    const config = davis.config;
    config.getConfiguration()
      .then(c => {
        const dynatrace = c.dynatrace;
        res.send({ success: true, dynatrace });
      })
      .catch(err => {
        res.send({ success: false, message: err.message });
      });
  })

  // returns the dynatrace configuration
  .put((req, res) => {
    const davis = req.app.get('davis');
    const config = davis.config;
    config.updateConfig({ dynatrace: req.body })
      .then(() => {
        res.send({ success: true, message: 'Dynatrace configuration successfully updated!' });
      })
      .catch(err => {
        res.send({ success: false, message: err.message });
      });
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
