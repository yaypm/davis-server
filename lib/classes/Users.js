'use strict';

const DError = require('./Error').DError;
const BbPromise = require('bluebird');
const jwt = require('jsonwebtoken');
const _ = require('lodash');

const UserModel = require('../models/User');

const JWT_TOKEN = 'Wu35AFc29Et2Lh4haFwT';
const TOKEN_EXPIRATION = 86400; // 24 hours in seconds

class Users {
  constructor(davis) {
    this.logger = davis.logger;

    this.davis = davis;
  }

  createUser(email, password, admin) {
    return new BbPromise((resolve, reject) => {
      const user = new UserModel();
      user.email = email;
      user.password = password;
      user.admin = admin || false;
      user.save(err => {
        if (err) {
          // duplicate entry
          if (err.code === 11000) {
            reject(new DError('A user with that username already exists.'));
          } else {
            reject(new DError(err));
          }
        }

        // return a message
        resolve('User created!');
      });
    });
  }

  getAllUsers() {
    return new BbPromise((resolve, reject) => {
      UserModel.find((err, users) => {
        if (err) reject(new DError(err));

        // return the users
        return resolve(users);
      });
    });
  }

  getUser(email) {
    return new BbPromise((resolve, reject) => {
      UserModel.findOne({ email }, (err, user) => {
        if (err) reject(err);

        // return the user
        return resolve(user);
      });
    });
  }

  updateUser(email, userUpdates) {
    return new BbPromise((resolve, reject) => {
      UserModel.findOne({ email }, (err, user) => {
        if (err) reject(new DError(err));

        // TODO - Investigate using destructuring
        if (userUpdates.email) user.email = userUpdates.email;
        if (userUpdates.password) user.password = userUpdates.password;
        if (_.isBoolean(userUpdates.admin)) user.admin = userUpdates.admin;

        user.save().then(() => resolve());
      });
    });
  }

  deleteUser(email) {
    return new BbPromise((resolve, reject) => {
      UserModel.findOneAndRemove({ email }, err => {
        if (err) reject(new DError(err));

        resolve();
      });
    });
  }

  authenticateUser(email, password) {
    return new BbPromise((resolve, reject) => {
      UserModel.findOne({ email }).select('email password admin').exec()
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
                admin: user.admin,
              }, JWT_TOKEN, {
                expiresIn: TOKEN_EXPIRATION,
              });

              // return the information including token as JSON
              resolve(token);
            }
          }
        });
    });
  }

  verifyToken(token, cb) {
    // return new BbPromise((resolve, reject) => {
    jwt.verify(token, JWT_TOKEN, cb);
      /*resolve({
        email: 'michael.beemer@ruxit.com',
        admin: true,
      });*/
    // });
  }
}

module.exports = Users;
