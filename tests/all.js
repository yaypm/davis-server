'use strict';

const mongoose = require('mongoose');

before(done => {
  function clearDB() {
    for (let i in mongoose.connection.collections) {
      mongoose.connection.collections[i].remove(function () {
      });
    }
    return done();
  }

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

after(done => {
  mongoose.disconnect();
  return done();
});

// require('./classes/Davis');
// require('./classes/Service');
require('./classes/Users');
require('./classes/Exchange');
