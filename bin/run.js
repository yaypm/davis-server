#!/usr/bin/env node
'use strict';

/**
 * Module dependencies.
 */
const app = require('../app'),
    cluster = require('cluster'),
    logger = require('../app/utils/logger');

logger.info('Starting Davis');
if (cluster.isMaster && app.get('env') == 'production') {

    for (let i = 0; i < require('os').cpus().length; i++) {
        cluster.fork();
    }

    cluster.on('exit', (worker, code, signal) => {
        logger.warn('worker %d died (%s). restarting...',
            worker.process.pid, signal || code);
        cluster.fork();
    });

    cluster.on('listening', (worker, address) => {
        let host = address.address || 'localhost';
        logger.info('Worker [%s] now listening on %s:%s', worker.process.pid, host, address.port);
    });

} else {
    let port = process.env.PORT || 3000,
        ip =  process.env.IP || '0.0.0.0';

    app.listen(port, ip, () => {
        logger.info('Davis Server running on %s:%s', ip, port);
    });
}  