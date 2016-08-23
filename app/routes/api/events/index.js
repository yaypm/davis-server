'use strict';

const router = require('express').Router(),
    problems = require('./problems');

router.use('/problems', problems);

module.exports = router;