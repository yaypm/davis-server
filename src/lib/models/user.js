"use strict";

const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Joi = require("joi");
const moment = require("moment-timezone");

const DError = require("../core/error");

require("./tenant");

const timezoneEnum = {
  values: moment.tz.names(),
  message: "'{VALUE}' is an invalid timezone.",
};

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    validate: {
      validator: v => Joi.validate(v, Joi.string().email()).error === null,
      message: "Invalid email address!",
    },
    required: [true, "An email address is required!"],
  },
  firstName: {
    type: String,
    trim: true,
    required: [true, "A first name is required!"],
  },
  lastName: {
    type: String,
    trim: true,
    required: [true, "A last name is required!"],
  },
  password: {
    type: String,
    select: false,
    required: [true, "A password is required!"],
  },
  tenant: { type: "ObjectId", ref: "Tenant" },
  timezone: {
    type: String,
    trim: true,
    enum: timezoneEnum,
    default: "Etc/UTC",
  },
}, {
  timestamps: true,
});

class UserClass {
  async checkPass(password) {
    return bcrypt.compare(password, this.password);
  }

  get dynatraceUrl() {
    return this.tenant.url;
  }

  get dynatraceApiUrl() {
    return this.tenant.apiUrl || this.tenant.url;
  }

  dynatraceApiTokens() {
    const active = this.tenant.access.active % this.tenant.access.tokens.length;
    return this.tenant.access.tokens.slice(active)
      .concat(this.tenant.access.tokens.slice(0, active));
  }
}


const autoPopulateLead = function (next) {
  this.populate("tenant");
  next();
};

userSchema.pre("findOne", autoPopulateLead);
userSchema.pre("find", autoPopulateLead);

userSchema.post("save", DError.handleMongoError);
userSchema.loadClass(UserClass);
module.exports = mongoose.model("User", userSchema);
