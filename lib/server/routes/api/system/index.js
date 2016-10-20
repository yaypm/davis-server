'use strict';

const router = require('express').Router();

router.use('/user', require('./user'));
router.use('/aliases', require('./aliases'));

module.exports = router;
