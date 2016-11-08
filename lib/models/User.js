'use strict';

const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');

const Schema = mongoose.Schema;

// Configuring Mongoose to use Promises
mongoose.Promise = require('bluebird');

const timezone = require('../config/timezones');

const timezoneEnum = {
  values: timezone,
  message: '`{VALUE}` is an invalid timezone',
};

const UserSchema = new Schema({
  email: { type: String, require: true, index: { unique: true } },
  password: { type: String, required: true, select: false },
  name: {
    first: { type: String },
    last: { type: String },
  },
  timezone: { type: String, enum: timezoneEnum, default: 'Etc/UTC' },
  lang: { type: String, default: 'en-us' },
  admin: { type: Boolean, default: false },
  alexa_ids: [
    { type: String, index: { unique: true } },
  ],
  slack_ids: [
    { type: String, index: { unique: true } },
  ],
}, {
  timestamps: true,
});

UserSchema.pre('save', function (next) {
  const user = this;

  if (!user.isModified('password')) return next();

  return bcrypt.hash(user.password, null, null, (err, hash) => {
    if (err) return next(err);

    user.password = hash;
    return next();
  });
});

UserSchema.methods.comparePassword = function (password) {
  const user = this;

  return bcrypt.compareSync(password, user.password);
};

module.exports = mongoose.model('User', UserSchema);
