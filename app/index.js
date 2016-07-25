'use strict';

const express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    favicon = require('serve-favicon'),
    routes = require('./routes/index'),
    logger = require('./utils/logger'),
    mongoose = require('mongoose');

module.exports = function setupApp(config) {

    app.set('davisConfig', config);
    logger.debug('Overriding Express logger');
    app.use(require('morgan')('combined', {'stream': logger.stream}));

    mongoose.connect(config.database.dsn, function (err) {
        if (err) throw err;
        logger.info('Successfully connected to mongodb');
    });

    app.use(favicon(`${__dirname}/../web/favicon.ico`));
    app.use(express.static(`${__dirname}/../web`));
    app.use('/bower_components', express.static(`${__dirname}/../bower_components`));

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: false}));
    app.use('/', routes);

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

    return app;
};



