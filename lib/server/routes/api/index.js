'use strict';

const router = require('express').Router();

const authenticate = require('../auth');

router.post('/authenticate', (req, res) => {
  const davis = req.app.get('davis');
  const users = davis.users;

  users.authenticateUser(req.body.email, req.body.password)
    .then((auth) => {
      // Make sure the davis URL is up to date
      davis.config.setDavisUrl(req);

      return res.json({
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
  users.getChromeToken(req.body.email, req.body.password, false)
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

router.post('/webAuth', (req, res) => {
  const davis = req.app.get('davis');
  const users = davis.users;
  const token = req.headers['x-access-token'];

  users.verifyToken(token, (err, decoded) => {
    if (err) return res.status(403).send({ status: false, message: err.message });
    users.getChromeToken(decoded.email, '', true)
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
router.use(authenticate.verifyToken);

router.post('/web', (req, res) => {
  const davis = req.app.get('davis');

  davis.logger.info('Received a request from the API');

  return davis.sources.web.askDavis(req).then(response => res.json(response));
});

router.use('/dynatrace', require('./dynatrace'));
router.use('/watson', require('./watson'));
router.use('/system', require('./system'));

// Catches 404
router.use((req, res) => { res.status(404).send({ status: false, message: 'Invalid route' }); });

module.exports = router;
