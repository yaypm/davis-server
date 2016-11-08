'use strict';

const BbPromise = require('bluebird');
const jwt = require('jsonwebtoken');
const _ = require('lodash');

const UserModel = require('../models/User');
const timezones = require('../config/timezones');

const TOKEN_EXPIRATION = 86400; // 24 hours in seconds

class Users {
  constructor(davis) {
    this.logger = davis.logger;
    this.config = davis.config;

    this.davis = davis;
  }

  getValidTimezones() {
    return timezones;
  }

  validateAlexaUser(alexaID) {
    return UserModel.findOne({ alexa_ids: alexaID }).exec()
      .then(user => {
        if (!user || user.length === 0) {
          this.logger.warn(`The Alexa ID '${alexaID}' hasn't been registered yet!`);
          throw new this.davis.classes.Error("Unfortunately, this device hasn't been authorized to use Davis yet!");
        }

        return {
          id: user._id,
          email: user.email,
          name: {
            first: user.name.first,
            last: user.name.last,
          },
          timezone: user.timezone,
        };
      });
  }
  
  validateSlackUser(member) {
    return UserModel.findOne({ slack_ids: member.id }).exec().bind(this)
      .then(user => {
        if (!user || user.length === 0) {
          this.logger.warn(`The Slack ID '${member.id}' hasn't been associated with a user yet!`);
        }

        // TODO: use user if found
        return {
          id: member.id,
          email: member.profile.email,
          name: {
                first: member.profile.first_name, 
                last: member.profile.last_name
          },
          timezone: member.tz,
        };
      });
  }

  createUser(email, password, admin) {
    return BbPromise.resolve()
      .then(() => {
        const user = new UserModel();
        user.email = email;
        user.password = password;
        user.admin = admin || false;
        return user.save();
      })
      .then(() => 'user created!')
      .catch(err => {
        if (err.code === 11000) {
          throw new this.davis.classes.Error('A user with that username already exists.');
        } else {
          throw new this.davis.classes.Error(err);
        }
      });
  }

  getAllUsers() {
    return UserModel.find.exec();
  }

  getUser(email) {
    return UserModel.findOne({ email }).exec();
  }

  adminExists() {
    return UserModel.find({ admin: true }).limit(1).exec()
      .then((adminUsers) => adminUsers.length > 0);
  }

  updateUser(email, userUpdates) {
    return UserModel.findOne({ email }).exec()
      .then(user => {
        if (!user) throw new this.davis.classes.Error(`Unable to find a user with the email address '${email}'.`);

        _.assign(user, userUpdates);
        return user.save();
      });
  }

  deleteUser(email) {
    return UserModel.findOneAndRemove({ email }).exec();
  }

  authenticateUser(email, password) {
    return UserModel.findOne({ email }).select('email password admin').exec()
      .then(user => {
        let token;
        // no user with that username was found
        if (!user) {
          throw new this.davis.classes.Error('Authentication failed. User not found.');
        } else if (user) {
          // check if password matches
          const validPassword = user.comparePassword(password);
          if (!validPassword) {
            throw new this.davis.classes.Error('Authentication failed. Wrong password.');
          } else {
            // if user is found and password is right
            // create a token
            token = jwt.sign({
              email: user.email,
              admin: user.admin,
            }, this.config.getJwtToken(), {
              expiresIn: TOKEN_EXPIRATION,
            });
          }
        }
        return token;
      });
  }

  verifyToken(token, cb) {
    jwt.verify(token, this.config.getJwtToken(), cb);
  }
}

module.exports = Users;
