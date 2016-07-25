'use strict';
const logger = require('./app/utils/logger');
const express = require('./app');


class DavisServer {
    constructor(config) {
        this.app = express(config);
    }
    run(cb) {
        const that = this;
        const davisConfig = that.app.get('davisConfig');
        const server = that.app.listen(davisConfig.port, davisConfig.ip, function () {
            logger.info('Davis server listening at http://' + davisConfig.ip + ':'+ davisConfig.port );
            if(cb) return cb(that.app);
        });

    }
}

module.exports = exports = DavisServer;