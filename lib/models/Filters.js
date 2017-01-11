'use strict';

const mongoose = require('mongoose');
const _ = require('lodash');

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

const originEnum = {
  values: ['NOTIFICATION', 'QUESTION', 'ALL'],
  message: '`{VALUE}` is an invalid filter direction. Please use NOTIFICATION, QUESTION, or ALL.',
};

const FilterSchema = new Schema({
  name: { type: String, trim: true, unique: [true, 'You must uniquely name this filter.'], required: [true, 'A filter name is required'] },
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
  origin: { type: String, uppercase: true, trim: true, enum: originEnum, default: 'ALL' },
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

FilterSchema.methods.problemMatch = function (problem) {
  console.log(`Looking at filter ${this.name}`);
  if (this.status.length > 0 && this.status.indexOf(problem.status) === -1) {
    console.log(`A status was required but not found: ${problem.status}`);
    return false;
  }

  if (this.impact.length > 0 && this.impact.indexOf(problem.impactLevel) === -1) {
    console.log(`An impact was required but not found: ${problem.impactLevel}`);
    return false;
  }

  if (problem.severityLevel && this.severityLevel.length > 0) {
    if (this.impact.indexOf(problem.severityLevel) === -1) {
      console.log(`An matching severity was required but not found: ${problem.severityLevel}`);
      return false;
    }
  }

  if (problem.tagsOfAffectedEntities && (this.tags.includes.length > 0 || this.tags.excludes.length > 0)) {
    const keys = _.map(problem.tagsOfAffectedEntities, tag => tag.key);
    if (_.intersection(keys, this.tags.excludes).length > 0) {
      console.log('Found at least one matching exclude tag');
      return false;
    }
    if (_.intersection(keys, this.tags.includes).length !== this.tags.includes.length) {
      console.log('Some of the required tags were missing');
      return false;
    }
  }

  if (this.entityID.length > 0 || this.excludeEventType.length > 0) {
    // rankedImpacts = problem feed, rankedEvents = problem details
    const events = problem.rankedImpacts || problem.rankedEvents;
    let hasMatchingEntityID = false;
    for (const event of events) {
      if (this.entityID.length > 0 && !hasMatchingEntityID && this.entityID.indexOf(event.entityId) === -1) hasMatchingEntityID = true;
      if (this.excludeEventType.length > 0 && this.excludeEventType.indexOf(event.eventType) !== -1) {
        console.log(`Found an excluded event type '${event.eventType}'`);
        return false;
      }
    }
    if (!hasMatchingEntityID) {
      console.log("The problem didn't contain a matching entity ID.");
      return false;
    }
  }

  return true;
};

module.exports = mongoose.model('Filter', FilterSchema);
