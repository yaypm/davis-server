'use strict';

const router = require('express').Router();

router.use('/users', require('./users'));

// Restricts all the routes below to admin users only.
router.use((req, res, next) => {
  if (req.decoded.admin === false) {
    return res.send({ success: false, message: 'Unauthorized.' });
  }
  return next();
});

router.use('/aliases', require('./aliases'));
router.use('/config', require('./config'));

module.exports = router;
