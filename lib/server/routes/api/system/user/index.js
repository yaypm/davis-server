'use strict';

const router = require('express').Router(); // eslint-disable-line new-cap

const User = require('../../../../../models/User');

router.route('/')
  .post((req, res) => {
    const user = new User();		// create a new instance of the User model
    user.email = req.body.email;  // set the users username (comes from the request)
    user.password = req.body.password;  // set the users password (comes from the request)

    user.save(function(err) {
      if (err) {
				// duplicate entry
        if (err.code === 11000) {
          return res.json({ success: false, message: 'A user with that username already exists. ' });
        } else {
          return res.send(err);
        }
      }

			// return a message
      res.json({ message: 'User created!' });
    });
  })
  // get all the users (accessed at GET http://localhost:8080/api/users)
  .get(function(req, res) {
    User.find(function(err, users) {
      if (err) return res.send(err);

      // return the users
      res.json(users);
    });
	});

module.exports = router;
