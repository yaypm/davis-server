'use strict';

const router = require('express').Router(),
    aliases = require('./aliases');

router.use('/aliases', aliases);

module.exports = router;