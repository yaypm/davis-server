'use strict';

const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

// Configuring Mongoose to use Promises
mongoose.Promise = require('bluebird');

const type = {
    values: 'applications services infrastructure'.split(' '),
    message: '`{VALUE}` is an invalid `{PATH}`.'
};

const aliases = new Schema({
    name: { type: String, required: true, unique: false},
    category: { type: String, required: true, enum: type },
    display: {
        audible: { type: String, required: false, unique: false, index: false},
        visual: { type: String, required: false, unique: false, index: false}
    },
    aliases: [String]
}, {
    timestamps: true
});

// Makes sure aliases names are unique per type
aliases.index({name: 1, category: 1}, {unique: true});

module.exports = mongoose.model('Aliases', aliases);