'use strict';

const mongoose = require('mongoose'),
    validators = require('mongoose-validators'),
    Schema = mongoose.Schema;

// Configuring Mongoose to use Promises
mongoose.Promise = require('bluebird');

const state = {
    values: 'OPEN RESOLVED'.split(' '),
    message: '`{VALUE}` is an invalid `{PATH}`.'
};

const impact = {
    values: 'APPLICATION SERVICES INFRASTRUCTURE'.split(' '),
    message: '`{VALUE}` is an invalid `{PATH}`.'
};

const problems = new Schema({
    PID: { type: String, required: true, unique: true, index: true },
    ProblemID: { type: String, required: true },
    State: { type: String, enum: state, required: true},
    ProblemImpact: { type: String, enum: impact, required: true},
    ProblemURL: { type: String, validate: validators.isURL(), required: true },
    ImpactedEntity: { type: String, required: true },
    Tags: { type: Array, required: false }
});

problems.pre('validate', function(next) {
    //Moving the comma separated list into an array before the validate occurs
    this.Tags = (this.Tags[0] !== '') ? this.Tags[0].replace(/ /g, '').split(',') : null;
    next();
});

module.exports = mongoose.model('Problems', problems);