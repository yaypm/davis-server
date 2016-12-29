'use strict';

const auth = {
  verifyToken: (req, res, next) => {
    const davis = req.app.get('davis');
    const token = req.headers['x-access-token'];

    const users = davis.users;
    users.verifyToken(token, (err, decoded) => {
      if (err) {
        let message;
        if (err.name === 'TokenExpiredError') {
          message = 'Your token has expired.';
        } else if (err.name === 'JsonWebTokenError') {
          message = 'Your token is invalid.';
        }
        return res.status(403).send({ status: false, message: message || err.message });
      }

      req.decoded = decoded;
      return next();
    });
  },
};

module.exports = auth;
