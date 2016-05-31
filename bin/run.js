#!/usr/bin/env node

/**
 * Module dependencies.
 */
var app = require('../app');
var cluster = require('cluster');



// Setup a database connection
// var url = 'mongodb://localhost:27017/showcase';

if (cluster.isMaster && app.get('env') == 'production') {

    for (var i = 0; i < require('os').cpus().length; i++) {
        cluster.fork();
    }

    cluster.on('exit', function(worker, code, signal) {
        console.log('worker %d died (%s). restarting...',
            worker.process.pid, signal || code);
        cluster.fork();
    });

    cluster.on('listening', function(worker, address) {
        var host = address.address || 'localhost';
        console.log("Worker [%s] now listening on %s:%s", worker.process.pid, host, address.port);
    });

} else {
    var server = app.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function() {
        console.log('Davis Server running on %s:%s', process.env.IP, process.env.PORT);
    });
}  