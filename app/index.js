'use strict';

const express = require('express'),
    app = express(),
    server = require('http').Server(app),
    io = require('socket.io')(server),
    bodyParser = require('body-parser'),
    favicon = require('serve-favicon'),
    routes = require('./routes/index'),
    logger = require('./utils/logger'),
    version = require('./utils/version'),
    AccountService = require('./services/AccountService'),
    _ = require('lodash'),
    mongoose = require('mongoose');

module.exports = function setupApp(config) {

    app.set('davisConfig', config);
    logger.debug('Overriding Express logger');
    app.use(require('morgan')('tiny', {
        stream: logger.stream,
        skip: req => {
            return req.url.startsWith('/favicon.ico') || req.url.startsWith('/healthCheck.html');
        }
    }));
    
    // For Chrome extension
    io.on('connection', function (socket) {
        logger.info('A new socket.io connection detected');
        
        setTimeout( () => {
            sendUrl('cwoolf', 'http://www.nooooooooooooooo.com/');
        }, 5000);

    });
    
    function sendUrl (userId, url) {
        io.sockets.emit('url-'+userId, url);
    }

    mongoose.connect(config.database.dsn, function (err) {
        if (err) throw err;
        logger.info('Successfully connected to mongodb');
    });

    app.use(favicon(`${__dirname}/../web/favicon.ico`));
    app.use(express.static(`${__dirname}/../web`));

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: false}));
    app.use('/', routes);

    /**
     * Getting Git version
     */
    version.init()
        .then( () => {
            logger.info('Successfully got Git version');
        });

    /**
     * Starting slackbot
     */
    if (config.slack.enabled && config.slack.key) {
        require('./integrations/slack')(config);
    }

    // catch 404 and forward to error handler
    app.use(function (req, res, next) {
        var err = new Error('Not Found');
        err.status = 404;
        next(err);
    });

    // error handlers

    // development error handler
    // will print stacktrace
    if (app.get('env') === 'development') {
        app.use(function (err, req, res) {
            res.status(err.status || 500);
            res.json({
                message: err.message,
                error: err
            });
        });
    }

    // production error handler
	// no stacktraces leaked to user
    app.use(function (err, req, res) {
        res.status(err.status || 500);
        res.json({
            message: err.message,
            error: {}
        });
    });

    return { app, server };
};



