'use strict';

const DError = require('./Error').DError;
const BbPromise = require('bluebird');
const jwt = require('jsonwebtoken');
const _ = require('lodash');

const UserModel = require('../models/User');
const timezones = require('../config/timezones');

const JWT_TOKEN = 'Wu35AFc29Et2Lh4haFwT';
const TOKEN_EXPIRATION = 86400; // 24 hours in seconds

class Users {
  constructor(davis) {
    this.logger = davis.logger;

    this.davis = davis;
  }

  static getValidTimezones() {
    return timezones;
  }

  validateAlexaUser(alexaID) {
    return UserModel.findOne({ alexa_ids: alexaID }).exec()
      .then(user => {
        if (!user || user.length === 0) {
          this.logger.warn(`The Alexa ID '${alexaID}' hasn't been registered yet!`);
          throw new DError('Unfortunately, this device hasn\'t been authorized to use Davis yet!');
        }

        return {
          id: user._id, // eslint-disable-line no-underscore-dangle
          email: user.email,
          name: {
            first: user.name.first,
            last: user.name.last,
          },
          timezone: user.timezone,
        };
      });
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
    return UserModel.find.exec();
  }

  getUser(email) {
    return UserModel.findOne({ email }).exec();
  }

  updateUser(email, userUpdates) {
    return UserModel.findOne({ email }).exec()
      .then(user => {
        if (!user) throw new DError(`Unable to find a user with the email address '${email}'.`);
        // TODO - Investigate using destructuring
        if (userUpdates.email) user.email = userUpdates.email;
        if (userUpdates.password) user.password = userUpdates.password;
        if (userUpdates.name) {
          if (userUpdates.name.first) user.name.first = userUpdates.name.first;
          if (userUpdates.name.last) user.name.last = userUpdates.name.last;
        }
        if (userUpdates.timezone) user.timezone = userUpdates.timezone;
        // Lang
        if (_.isBoolean(userUpdates.admin)) user.admin = userUpdates.admin;
        if (userUpdates.alexa_ids) user.alexa_ids = userUpdates.alexa_ids;
        if (userUpdates.slack_ids) user.slack_ids = userUpdates.slack_ids;

        return user.save();
      });
  }

  deleteUser(email) {
    return UserModel.findOneAndRemove({ email }).exec();
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
    jwt.verify(token, JWT_TOKEN, cb);
  }
}

module.exports = Users;
