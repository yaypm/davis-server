'use strict';

const router = require('express').Router(); // eslint-disable-line new-cap

router.use('/problems', require('./problems'));

module.exports = router;
