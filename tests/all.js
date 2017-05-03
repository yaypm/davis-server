const dotenv = require("dotenv");
const BbPromise = require("bluebird");
const mongoose = require("mongoose");

const AliasModel = require("../src/lib/models/alias");
const UserModel = require("../src/lib/models/user");

dotenv.config();
process.env.test = true;
process.env.DAVIS_LOG_LEVEL = "warn";

global.Promise = BbPromise;
mongoose.Promise = BbPromise;

// Set up MongoDB Connection
before(() => {
  if (mongoose.connection.readyState === 0) {
    return mongoose.connect("localhost/davis-ng-test")
      .catch((err) => {
        throw new Error("Cannot connect to MongoDB");
      });
  }
});

// Drop all collections before each test
beforeEach(() => {
  return Promise.all([
    UserModel.remove().exec(),
    AliasModel.remove().exec(),
  ]);
});

after(() => {
  return mongoose.connection.db.dropDatabase()
    .then(() => mongoose.disconnect());
});

require("./builder");
require("./dynatrace");
