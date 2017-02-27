'use strict';

const BbPromise = require('bluebird');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const rand = require('rand-token');

const UserModel = require('../models/User');
const timezones = require('../config/timezones');

const DAVIS_INTERNAL_EMAIL = 'davis@internal';
const TOKEN_EXPIRATION = 86400; // 24 hours in seconds
const MINIMUM_PASSWORD_LENGTH = 6;

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
      .then((user) => {
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

  isChromeTokenValid(token) {
    return UserModel.findOne({ chromeToken: token }).exec()
      .then((user) => {
        if (_.isNull(user)) {
          return false;
        }
        return true;
      });
  }

  validateSlackUser(member) {
    return UserModel.findOne({ slack_ids: member.id }).exec()
      .then((user) => {
        if (!user || user.length === 0) {
          this.logger.warn(`The Slack ID '${member.id}' hasn't been associated with a user yet!`);

          // Building a user with the information Slack provided.
          return {
            id: member.id,
            email: member.profile.email,
            name: {
              first: member.profile.first_name,
              last: member.profile.last_name,
            },
            timezone: member.tz,
            url: this.config.getDynatraceUrl(),
          };
        }

        return {
          id: user._id,
          email: _.get(user, 'email', member.profile.email),
          name: {
            first: _.get(user, 'name.first', member.profile.first_name),
            last: _.get(user, 'name.last', member.profile.last_name),
          },
          timezone: _.get(user, 'timezone', member.tz),
          url: this.config.getDynatraceUrl(),
        };
      });
  }

  getSystemUser() {
    const name = { first: 'system', last: 'user' };
    return UserModel.findOne({ email: DAVIS_INTERNAL_EMAIL }).exec()
      .then((user) => {
        if (_.isNull(user)) {
          const systemUser = new UserModel({
            email: DAVIS_INTERNAL_EMAIL,
            name,
            password: rand.generate(16),
            internal: true,
          });
          return systemUser.save();
        }
        return user;
      })
      .then((user) => {
        const systemUser = {
          id: user._id,
          timezone: user.timezone,
          url: this.config.getDynatraceUrl(),
        };
        return systemUser;
      });
  }

  createUser(userData) {
    return BbPromise.try(() => {
      if (_.isNil(userData.email)) throw new this.davis.classes.Error('A valid email is required!');
      if (_.isNil(userData.password)) throw new this.davis.classes.Error('A password is required!');
      if (userData.password.length < MINIMUM_PASSWORD_LENGTH) {
        throw new this.davis.classes.Error('A password with at least 6 characters is required!');
      }
    })
      .then(() => {
        const user = new UserModel(userData);
        return user.save();
      })
      .then(() => {
        if (userData.email !== 'admin@localhost') {
          return this.deleteUser('admin@localhost');
        }
        return null;
      })
      .then(() => this.createJwtToken(userData))
      .catch((err) => {
        if (err.code === 11000) {
          throw new this.davis.classes.Error('A user with that email address already exists.');
        } else if (err.name === 'DavisError') {
          throw err;
        } else {
          throw new this.davis.classes.Error(err);
        }
      });
  }

  createDefaultUser() {
    return this.createUser({
      email: 'admin@localhost',
      password: 'changeme',
      admin: true,
      name: {
        first: 'admin',
        last: 'localhost',
      },
    });
  }

  getAllUsers() {
    return UserModel
      .find({})
      .where('internal').equals(false)
      .sort({ 'name.last': 1, 'name.first': 1 })
      .select('-internal')
      .exec();
  }

  getUser(email) {
    return UserModel.findOne({ email: { $in: [email, email.toLowerCase()] } }).exec();
  }

  adminExists() {
    return UserModel.find({ admin: true }).limit(1).exec()
      .then(adminUsers => adminUsers.length > 0);
  }

  updateUser(email, userUpdates) {
    return BbPromise.try(() => {
      if (_.has(userUpdates, 'password') && (userUpdates.password.length < MINIMUM_PASSWORD_LENGTH)) {
        throw new this.davis.classes.Error('A password with at least 6 characters is required!');
      }
    })
      .then(() => UserModel.findOne({ email: { $in: [email, email.toLowerCase()] } }).exec())
      .then((user) => {
        if (!user) throw new this.davis.classes.Error(`Unable to find a user with the email address '${email}'.`);

        _.assign(user, userUpdates);
        return user.save();
      });
  }

  deleteUser(email) {
    return UserModel.find({ admin: true }).exec()
      .then((users) => {
        if (users.length <= 1 && users[0].email === email) {
          throw new this.davis.classes.Error(`Cannot delete last admin user ${email}`);
        }

        return UserModel.findOneAndRemove({ email: { $in: [email, email.toLowerCase()] } }).exec();
      });
  }

  authenticateUser(email, password) {
    return BbPromise.try(() => {
      if (_.isNil(email)) throw new this.davis.classes.Error('A valid email is required!');
      if (_.isNil(password)) throw new this.davis.classes.Error('A password is required!');
    })
      .then(() => UserModel.findOne({ email: { $in: [email, email.toLowerCase()] } }).select('email password admin').exec())
      .then((user) => {
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
            token = this.createJwtToken(user);
          }
        }
        return {
          token,
          admin: user.admin,
        };
      });
  }

  getChromeToken(email, password, isWebUI) {
    return UserModel.findOne({ email: { $in: [email, email.toLowerCase()] } }).select('email password chromeToken').exec()
      .then((user) => {
        let token;
        // no user with that username was found
        if (!user) {
          throw new this.davis.classes.Error('Authentication failed. User not found.');
        } else if (user) {
          // check if password matches
          const validPassword = user.comparePassword(password);
          if (!validPassword && !isWebUI) {
            throw new this.davis.classes.Error('Authentication failed. Wrong password.');
          } else {
            // if user is found and password is right
            // create a token
            token = user.chromeToken;
          }
        }
        return token;
      });
  }

  verifyToken(token, cb) {
    jwt.verify(token, this.config.getJwtToken(), cb);
  }

  createJwtToken(user) {
    return jwt.sign({
      email: user.email,
      admin: user.admin,
    }, this.config.getJwtToken(), {
      expiresIn: TOKEN_EXPIRATION,
    });
  }
}

module.exports = Users;
