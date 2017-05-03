"use strict";

const mongoose = require("mongoose");

const aliasSchema = new mongoose.Schema({
  aliases: [ String ],
  createdAt: Date,
  display: {
    audible: String,
    visual: String,
  },
  entityId: { type: String, unique: true },
  tenant: String,
});

aliasSchema.pre("save", function(next) {
  if (!this.createdAt) {
    this.createdAt = new Date();
  }
  next();
});

module.exports = mongoose.model('Alias', aliasSchema);

