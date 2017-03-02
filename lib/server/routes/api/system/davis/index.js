'use strict';

const _ = require('lodash');
const router = require('express').Router();

router.route('/')
  // returns the current davis configuration
  .get((req, res) => {
    const davis = req.app.get('davis');
    const config = davis.config;

    config.getDavis()
      .then((c) => {
        res.send({ success: true, config: c });
      })
      .catch((err) => {
        res.send({ success: false, message: err.message });
      });
  })

  // inserts the davis configuration
  .post((req, res) => {
    const davis = req.app.get('davis');
    const config = davis.config;

    config.updateConfig('davis', req.body)
      .then(() => {
        res.send({ success: true, message: `davis configuration successfully updated!` });
      })
      .catch((err) => {
        res.send({ success: false, message: err.message });
      });
  });

module.exports = router;
