'use strict';

const DavisServer = require('../DavisServer');

try {
    const davisServer = new DavisServer(require('./config'));

    davisServer.run();
} catch(err) {
    console.log(err);
    process.exit(1);
}