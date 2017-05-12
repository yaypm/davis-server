"use strict";

const mongoose = require("mongoose");
const Joi = require("joi");

const DError = require("../core/error");
require("./user");

const tenantSchema = new mongoose.Schema({
  owner: { type: "ObjectId", ref: "User", required: true },
  admins: [{ type: "ObjectId", ref: "User" }],
  users: [{ type: "ObjectId", ref: "User" }],
  url: {
    type: String,
    validate: {
      validator: v => Joi.validate(v, Joi.string().uri({ Schema: "https" })).error === null,
      message: "Invalid tenant API URL!",
    },
    required: [true, "A tenant URL is required!"],
  },
  apiUrl: {
    type: String,
    validate: {
      validator: v => Joi.validate(v, Joi.string().uri({ Schema: "https" })).error === null,
      message: "Invalid tenant API URL!",
    },
  },
  name: { type: String, required: [true, "A tenant name is required!"] },
  description: String,
  access: {
    active: {
      type: Number,
      default: 0,
      min: [0, "Active tokens should never be a negative number!"],
    },
    tokens: {
      type: Array,
      validate: {
        validator: (v) => {
          const test = Joi.array().unique().items(Joi.string()).min(1);
          return Joi.validate(v, test).error === null;
        },
        message: "At least one valid API token is required!",
      },
    },
  },
}, { timestamps: true });

tenantSchema.index({ name: 1, url: 1 }, { unique: [true, "This name is already being used!"] });

class TenantClass {
  get apiTokens() {
    const active = this.access.active % this.access.tokens.length;
    return this.access.tokens.slice(active)
      .concat(this.access.tokens.slice(0, active));
  }

  async setActiveToken(i) {
    const index = this.access.tokens.indexOf(i);
    if (index === -1) {
      throw new DError(`Unable to find ${i} on ${this._id}.`);
    }
    this.access.active = this.access.tokens.indexOf(i);
    await this.save();
  }
}

tenantSchema.post("save", DError.handleMongoError);
tenantSchema.post("update", DError.handleMongoError);

tenantSchema.loadClass(TenantClass);
module.exports = mongoose.model("Tenant", tenantSchema);
