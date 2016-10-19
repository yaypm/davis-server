'use strict';

const router = require('express').Router(); // eslint-disable-line new-cap

router.post('/authenticate', (req, res) => {
  const davis = req.app.get('davis');
  const { classes: { User } } = davis;

  const user = new User(davis);
  user.authenticate(req.body.email, req.body.password)
    .then(token => {
      res.json({
        success: true,
        message: 'Authentication successful!',
        token,
      });
    })
    .catch(err => {
      res.json({
        success: false,
        message: err.message,
      });
    });
});

router.use('/watson', require('./watson'));
router.use('/events', require('./events'));
router.use('/system', require('./system'));

module.exports = router;
