const express = require('express'),
    router = express.Router(),
    alexa = require('../intergrations/alexa/routes');

router.get('/', function(req, res, next) {
    res.json({message: 'Hello I\'m Davis'}) ;
});

router.use('/alexa', alexa);

module.exports = router;