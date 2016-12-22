'use strict';

const router = require('express').Router();

router.use((req, res, next) => {
  const davis = req.app.get('davis');
  davis.logger.info(`${req.method}: ${req.originalUrl}`);
  return next();
});


router.post('/authenticate', (req, res) => {
  const davis = req.app.get('davis');
  const users = davis.users;
  users.authenticateUser(req.body.email, req.body.password)
    .then((auth) => {
      res.json({
        success: true,
        message: 'Authentication successful!',
        admin: auth.admin,
        token: auth.token,
      });
    })
    .catch((err) => {
      res.json({
        success: false,
        message: err.message,
      });
    });
});

router.post('/chromeAuth', (req, res) => {
  const davis = req.app.get('davis');
  const users = davis.users;
  users.getChromeToken(req.body.email, req.body.password)
    .then((token) => {
      res.json({
        success: true,
        message: 'Authentication successful!',
        token,
      });
    })
    .catch((err) => {
      res.json({
        success: false,
        message: err.message,
      });
    });
});

router.post('/userInfo', (req, res) => {
  const davis = req.app.get('davis');
  const users = davis.users;
  const token = req.headers['x-access-token'];

  users.verifyToken(token, (err, decoded) => {
    if (err) return res.status(403).send({ status: false, message: err.message });

    return res.status(200).send({ status: true, user: decoded });
  });
});

router.use('/events', require('./events'));

// Validates JWT tokens
router.use((req, res, next) => {
  const davis = req.app.get('davis');
  const token = req.headers['x-access-token'];

  const users = davis.users;
  users.verifyToken(token, (err, decoded) => {
    if (err) return res.status(403).send({ status: false, message: err.message });

    req.decoded = decoded;
    return next();
  });
});

router.post('/web', (req, res) => {
  const davis = req.app.get('davis');

  davis.logger.info('Received a request from the API');

  return davis.sources.web.askDavis(req).then(response => res.json(response));
});

router.use('/watson', require('./watson'));
router.use('/system', require('./system'));

// Catches 404
router.use((req, res) => { res.status(404).send({ status: false, message: 'Invalid route' }); });

module.exports = router;
