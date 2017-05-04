"use strict";

const mongoose = require("mongoose");

const contextSchema = new mongoose.Schema({
  filters: {
    default: {},
    type: {
      app: String,
      time: {
        end: Number,
        start: Number,
      },
    },
  },

  intentHistory: [String],

  paging: {
    default: {
      active: 0,
      items: [],
      page: 0,
    },
    type: {
      active: Number,
      items: [{
        id: String,
        source: String,
        target: String,
      }],
      page: Number,
    },
  },

  // scope uniquely identifies the user
  // on the particular tenant and source
  scope: { type: String, unique: true },

  // target intent names
  // for various routing
  // intents
  targets: {
    default: {
      yes: {
        intent: null,
        value: {},
      },
      no: {
        intent: null,
        value: {},
      },
      num: {
        intent: null,
        choices: [],
      },
    },
    type: {
      yes: {
        intent: String,
        value: {},
      },
      no: {
        intent: String,
        value: {},
      },
      num: {
        intent: String,
        choices: [],
      },
    },
  },

  // the url to be used
  // whenever pushLink is
  // invoked
  url: String,

  // Expire after 5 minutes
  updatedAt: { type: Date, expires: 300 },
}, {
  timestamps: true,
});

module.exports = mongoose.model("Context", contextSchema);
