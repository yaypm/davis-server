"use strict";

const mongoose = require("mongoose");

require("./tenant");

const problemDetailSchema = new mongoose.Schema({
  tenant: { type: "ObjectId", ref: "Tenant", required: true },
  pid: { type: String, trim: true, required: true },
  startTime: Number,
  endTime: Number,
  eventType: String,
  displayName: String,
  impactLevel: String,
  status: String,
  severityLevel: String,
  tagsOfAffectedEntities: [{}],
  rankedEvents: [{}],
}, {
  timestamps: true,
});

problemDetailSchema.index({ createdAt: 1 }, { expires: "31d" });
problemDetailSchema.index({ tenant: 1, pid: 1 }, { unique: true });

module.exports = mongoose.model("ProblemDetail", problemDetailSchema);
