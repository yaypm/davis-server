'use strict';

const router = require('express').Router();

router.post('/authenticate', (req, res) => {
  const davis = req.app.get('davis');
  const Users = davis.classes.Users;

  const users = davis.users;
  users.authenticateUser(req.body.email, req.body.password)
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

// Validates JWT tokens
router.use((req, res, next) => {
  const davis = req.app.get('davis');
  const Users = davis.classes.Users;
  const token = req.body.token || req.query.token || req.headers['x-access-token'];

  const users = davis.users;
  users.verifyToken(token, (err, decoded) => {
    if (err) return res.status(403).send({ status: false, message: err.message });

    req.decoded = decoded;
    return next();
  });
});

router.use('/system', require('./system'));

module.exports = router;
