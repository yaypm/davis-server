'use strict';

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// Configuring Mongoose to use Promises
mongoose.Promise = require('bluebird');

const type = {
  values: 'applications services infrastructure'.split(' '),
  message: '`{VALUE}` is an invalid `{PATH}`.',
};

const aliases = new Schema({
  name: { type: String, trim: true, required: true, unique: false },
  category: { type: String, trim: true, required: true, enum: type },
  entityId: { type: String, trim: true, required: false, unique: true },
  display: {
    audible: { type: String, trim: true, required: false, unique: false, index: false },
    visual: { type: String, trim: true, required: false, unique: false, index: false },
  },
  aliases: [{ type: String, trim: true }],
}, {
  timestamps: true,
});

// Makes sure aliases names are unique per type
aliases.index({ name: 1, category: 1 }, { unique: true });

module.exports = mongoose.model('Aliases', aliases);
