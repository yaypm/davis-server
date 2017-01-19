'use strict';

const router = require('express').Router();
const rp = require('request-promise');
const os = require('os');
const BbPromise = require('bluebird');
const mongoose = require('mongoose');

router.use('/users', require('./users'));

router.route('/version')
  .get((req, res) => {
    const davis = req.app.get('davis');
    res.send({ success: true, version: davis.version });
  });

// Restricts all the routes below to admin users only.
router.use((req, res, next) => {
  if (req.decoded.admin === false) {
    return res.send({ success: false, message: 'You must be an admin to perform this action.' });
  }
  return next();
});

router.route('/info')
  .get((req, res) => {
    const davis = req.app.get('davis');

    const nodeVersion = process.version.replace(/^v/i, '');
    const davisVersion = davis.version;
    const nodeEnv = process.env.NODE_ENV;
    const davisUptime = process.uptime();
    const sysUptime = os.uptime();

    const npm = rp({
      uri: 'https://registry.npmjs.com/-/package/@dynatrace%2fdavis/dist-tags',
      json: true,
    })
      .then(npmRes => npmRes.latest);

    const mongo = mongoose.connection.db.admin().serverStatus()
      .then(info => info.version);

    BbPromise.all([npm, mongo])
      .spread((npmLatest, mongoVersion) => {
        const updatesAvailable = (npmLatest > davisVersion);
        const ret = {
          success: true,
          nodeVersion,
          nodeEnv,
          davisVersion,
          mongoVersion,
          davisUptime,
          sysUptime,
          npmLatest,
          updatesAvailable,
        };
        res.send(ret);
      })
      .catch((err) => {
        res.send({ success: false, message: err.message });
      });
  });

router.use('/aliases', require('./aliases'));
router.use('/config', require('./config'));
router.use('/filters', require('./filters'));
router.use('/slack', require('./slack'));

module.exports = router;
