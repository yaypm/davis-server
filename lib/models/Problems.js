'use strict';

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// Configuring Mongoose to use Promises
mongoose.Promise = require('bluebird');

const state = {
  values: 'OPEN RESOLVED'.split(' '),
  message: '`{VALUE}` is an invalid `{PATH}`.',
};

const impact = {
  values: 'APPLICATION SERVICES INFRASTRUCTURE'.split(' '),
  message: '`{VALUE}` is an invalid `{PATH}`.',
};

const problems = new Schema({
  PID: { type: String, required: true, unique: true, index: true },
  ProblemID: { type: String, required: true },
  State: { type: String, enum: state, required: true },
  ProblemImpact: { type: String, enum: impact, required: true },
  ProblemURL: { type: String, required: true },
  ImpactedEntity: { type: String, required: true },
  Tags: { type: Array, required: false },
});

module.exports = mongoose.model('Problems', problems);
