'use strict';

const router = require('express').Router();  // eslint-disable-line new-cap

router.use('/user', require('./user'));
router.use('/aliases', require('./aliases'));

module.exports = router;
