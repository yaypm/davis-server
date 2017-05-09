"use strict";

const mongoose = require("mongoose");

const DError = require("../core/error");

require("./tenant");

const aliasSchema = new mongoose.Schema({
  entityId: { type: String, unique: true, require: [true, "An entity ID is required!"] },
  tenant: { type: "ObjectId", ref: "Tenant", required: true },
  aliases: [String],
  display: {
    audible: String,
    visual: String,
  },
}, { timestamps: true });

aliasSchema.index({ entityId: 1, tenant: 1 }, { unique: [true, "This entity already has an alias!"] });

aliasSchema.post("save", DError.handleMongoError);
module.exports = mongoose.model("Alias", aliasSchema);

