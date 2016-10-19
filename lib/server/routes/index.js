'use strict';

const router = require('express').Router();  // eslint-disable-line new-cap

router.use('/api/v1', require('./api'));

module.exports = router;
