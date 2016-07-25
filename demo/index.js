'use strict';

const DavisServer = require('../DavisServer'),
    config = require('./config'),
    davisServer = new DavisServer(config);

davisServer.run();