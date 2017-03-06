'use strict';

const mongoose = require('mongoose');
const uid = require('rand-token').uid;

const Schema = mongoose.Schema;

// Configuring Mongoose to use Promises
mongoose.Promise = require('bluebird');

const type = {
  values: ['line', 'bar'],
  message: '`{VALUE}` is an invalid chart type.',
};

const ChartSchema = new Schema({
  uid: {
    type: String,
    index: true,
    default: () => { return uid(32); }, // eslint-disable-line arrow-body-style
  },
  width: { type: Number, default: 500 },
  height: { type: Number, default: 400 },
  scale: { type: Number, default: 1 },
  chart: {
    type: { type: String, trim: true, enum: type, default: 'line' },
    data: {
      labels: { type: Array, required: true },
      datasets: [{}],
    },
    options: {},
  },
  // Removes the data once the expired time arrives.
  createdAt: { type: Date, expires: '30d', default: Date.now },
});

module.exports = mongoose.model('Chart', ChartSchema);
