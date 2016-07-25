'use strict';

const DavisServer = require('../DavisServer');
const config = require('./config');
const davisServer = new DavisServer(config);
davisServer.run();