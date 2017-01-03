'use strict';

const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

// Configuring Mongoose to use Promises
mongoose.Promise = require('bluebird');

const statusEnum = {
  values: ['OPEN', 'CLOSED'],
  message: '`{VALUE}` is an invalid problem status.  Please use either OPEN or CLOSED.',
};

const impactEnum = {
  values: ['APPLICATION', 'SERVICE', 'INFRASTRUCTURE'],
  message: '`{VALUE}` is an invalid problem impact. Please use APPLICATION, SERVICE or INFRASTRUCTURE.',
};

const severityEnum = {
  values: ['AVAILABILITY', 'ERROR', 'PERFORMANCE', 'RESOURCE_CONTENTION', 'CUSTOM_ALERT'],
  message: '`{VALUE}` is an invalid problem severity. Please use AVAILABILITY, ERROR, PERFORMANCE, RESOURCE_CONTENTION or CUSTOM_ALERT.',
};

const directionEnum = {
  values: ['INCOMING', 'OUTGOING', 'BOTH'],
  message: '`{VALUE}` is an invalid filter direction. Please use INCOMING, OUTGOING, or BOTH.',
};

const FilterSchema = new Schema({
  name: { type: String, trim: true, unique: [true, 'You must name this filter.'], required: true },
  owner: {
    type: ObjectId,
    required: true,
    unique: false,
    index: false,
    ref: 'User',
  },
  description: { type: String, trim: true },
  enabled: { type: Boolean, default: true },
  scope: { type: String, trim: true, required: true },
  // Should this filter apply to webhooks, davis response or both
  direction: { type: String, uppercase: true, trim: true, enum: directionEnum },
  // Problem API Feed
  status: [{ type: String, uppercase: true, trim: true, enum: statusEnum }],
  // APPLICATION, SERVICE, or INFRASTRUCTURE.
  impact: [{ type: String, uppercase: true, trim: true, enum: impactEnum }],
  // AVAILABILITY, ERROR, PERFORMANCE, RESOURCE_CONTENTION or CUSTOM_ALERT
  severityLevel: [{ type: String, uppercase: true, trim: true, enum: severityEnum }],
  // Array of entity IDs
  entityID: [{ type: String, trim: true }],
  // Explicitly exclude these event types
  excludeEventType: [{ type: String, trim: true }],
  // Entity tags
  tags: {
    includes: [{ type: String, trim: true }],
    excludes: [{ type: String, trim: true }],
  },
});

module.exports = mongoose.model('Filter', FilterSchema);
