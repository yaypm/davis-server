'use strict';

const router = require('express').Router();

router.use('/user', require('./user'));
router.use('/aliases', require('./aliases'));
router.use('/config', require('./config'));

module.exports = router;
