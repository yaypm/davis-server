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

module.exports = {
  clearDB,
};

