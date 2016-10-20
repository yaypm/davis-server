'use strict';

const router = require('express').Router();

router.use('/problems', require('./problems'));

module.exports = router;
