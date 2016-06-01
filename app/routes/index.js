var express = require('express');
var router = express.Router();
var alexa = require('../frontends/alexa/routes');


router.get('/', function(req, res, next) {
   res.json({message: "Hello I'm Davis"}) ;
});

router.use('/alexa', alexa);



module.exports = router;