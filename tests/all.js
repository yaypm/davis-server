'use strict';

const mongoose = require('mongoose');
const BbPromise = require('bluebird');

function clearDB() {
  const colls = [];
  for (let i in mongoose.connection.collections) {
    colls.push(mongoose.connection.collections[i].remove());
  }
  return BbPromise.all(colls);
}

before(() => {
  if (mongoose.connection.readyState === 0) {
    mongoose.connect('127.0.0.1:27017/davis-test', err => {
      if (err) {
        throw new Error('Not connected to MongoDB!');
      }
      return clearDB();
    });
  } else {
    return clearDB();
  }
});

after(() => {
  return mongoose.disconnect();
});

// require('./classes/Davis');
// require('./classes/Service');
require('./classes/Users');
require('./classes/Dynatrace');
require('./classes/Exchange');
require('./classes/Decide');
require('./classes/Nlp');
require('./classes/ResponseBuilder');
require('./classes/PluginManager');
require('./classes/Nunjucks');
require('./classes/Express');
require('./classes/Filters');
