#!/usr/bin/env node
'use strict';

/**
 * Module dependencies.
 */
const app = require('../app'),
    cluster = require('cluster');

// Setup a database connection
// var url = 'mongodb://localhost:27017/showcase';

if (cluster.isMaster && app.get('env') == 'production') {

    for (let i = 0; i < require('os').cpus().length; i++) {
        cluster.fork();
    }

    cluster.on('exit', (worker, code, signal) => {
        console.log('worker %d died (%s). restarting...',
            worker.process.pid, signal || code);
        cluster.fork();
    });

    cluster.on('listening', (worker, address) => {
        let host = address.address || 'localhost';
        console.log('Worker [%s] now listening on %s:%s', worker.process.pid, host, address.port);
    });

} else {
    app.listen(process.env.PORT || 3000, process.env.IP || '0.0.0.0', () => {
        console.log('Davis Server running on %s:%s', process.env.IP, process.env.PORT);
    });
}  