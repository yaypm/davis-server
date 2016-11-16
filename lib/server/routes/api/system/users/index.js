'use strict';

const _ = require('lodash');
const router = require('express').Router();

router.route('/')
  // get all the users
  .get((req, res) => {
    const davis = req.app.get('davis');
    const users = davis.users;

    return users.getAllUsers()
      .then(allUsers => {
        res.send({ success: true, users: allUsers });
      })
      .catch(err => {
        res.send({ success: false, message: err.message });
      });
  });

router.route('/timezones')
  // Returns a list of valid timezones
  .get((req, res) => {
    const davis = req.app.get('davis');
    const users = davis.users;

    return res.send({ success: true, timezones: users.getValidTimezones() });
  });

router.route('/:user_email')
  // Creates a new user
  .post((req, res) => {
    const davis = req.app.get('davis');
    const email = req.params.user_email;
    const users = davis.users;

    if (req.decoded.admin === false) {
      return res.send({ success: false, message: 'Unauthorized.' });
    }

    return users.createUser(_.assign(req.body, { email }))
      .then(() => {
        res.json({ success: true, message: 'User created!' });
      })
      .catch(err => {
        res.json({ success: false, message: err.message });
      });
  })

  // Gets an individual user
  .get((req, res) => {
    const davis = req.app.get('davis');
    const email = req.params.user_email;
    const users = davis.users;

    if (req.decoded.admin === false && req.decoded.email !== email) {
      return res.send({ success: false, message: 'Unauthorized.' });
    }

    return users.getUser(email)
      .then(user => {
        res.send({ success: true, user });
      })
      .catch(err => {
        res.send({ success: false, message: err.message });
      });
  })

  // Updates a user
  .put((req, res) => {
    const davis = req.app.get('davis');
    const email = req.params.user_email;
    const users = davis.users;

    if (req.decoded.admin === false && req.decoded.email !== email) {
      return res.send({ success: false, message: 'Unauthorized.' });
    }

    return users.updateUser(email, req.body)
      .then(() => {
        res.send({ success: true, message: 'User updated!' });
      })
      .catch(err => {
        // err.errors.timezone.message;
        res.send({ success: false, message: err.message });
      });
  })

  // delete the user with this id
  .delete((req, res) => {
    const davis = req.app.get('davis');
    const email = req.params.user_email;
    const users = davis.users;

    if (req.decoded.admin === false && req.decoded.email !== email) {
      return res.send({ success: false, message: 'Unauthorized.' });
    }

    return users.getUser(email)
      .then(user => {
        res.send(user);
      })
      .catch(err => {
        res.send(err);
      });
  });

module.exports = router;
