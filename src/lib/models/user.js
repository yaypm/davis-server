"use strict";

const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  email: { type: String, unique: true },
  firstName: String,
  lastName: String,
  password: { type: String, select: false },
  activeTenantIdx: Number,
  tenants: [{
    apiUrl: String,
    name: String,
    token: String,
    url: String,
  }],
  timezone: String,
}, {
  timestamps: true,
});

userSchema.methods.checkPass = async function (password) {
  return bcrypt.compare(password, this.password);
};

userSchema.virtual("activeTenant").get(function () {
  const tenant = this.tenants[this.activeTenantIdx];
  return tenant;
});

userSchema.methods.getApiToken = function () {
  return process.env.DYNATRACE_TOKEN;
};

userSchema.methods.getEndpoint = function () {
  return process.env.DYNATRACE_URL;
};

module.exports = mongoose.model("User", userSchema);
