'use strict';

const DError = require('./Error').DError;
const BbPromise = require('bluebird');
const jwt = require('jsonwebtoken');

const UserModel = require('../models/User');

const JWT_TOKEN = 'Wu35AFc29Et2Lh4haFwT';

class User {
  constructor(davis) {
    this.davis = davis;
  }

  authenticate(email, password) {
    return new BbPromise((resolve, reject) => {
      UserModel.findOne({ email }).select('email password').exec()
        .then(user => {
          // no user with that username was found
          if (!user) {
            reject(new DError('Authentication failed. User not found.'));
          } else if (user) {
            // check if password matches
            const validPassword = user.comparePassword(password);
            if (!validPassword) {
              reject(new DError('Authentication failed. Wrong password.'));
            } else {
              // if user is found and password is right
              // create a token
              const token = jwt.sign({
                email: user.email,
              }, JWT_TOKEN, {
                expiresIn: (24 * 60 * 60), // expires in 24 hours
              });

              // return the information including token as JSON
              resolve(token);
            }
          }
        });
    });
  }
}

module.exports = User;
