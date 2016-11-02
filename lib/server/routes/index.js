'use strict';

const router = require('express').Router();

router.use('/alexa', require('./alexa'));
router.use('/api/v1', require('./api'));

// Catches 404
router.use((req, res) => { res.status(404).send({ status: false, message: 'Invalid route' }); });

module.exports = router;
