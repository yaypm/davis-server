'use strict';

const express = require('express'),
    app = express(),
    server = require('http').Server(app),
    io = require('socket.io')(server),
    bodyParser = require('body-parser'),
    favicon = require('serve-favicon'),
    routes = require('./routes/index'),
    logger = require('./utils/logger'),
    _ = require('lodash'),
    auth = require('http-auth'),
    mongoose = require('mongoose');
    
var activeSocketConnections = [];

module.exports = {
    setupApp: function(config) {

        app.set('davisConfig', config);
        logger.debug('Overriding Express logger');
        app.use(require('morgan')('tiny', {
            stream: logger.stream,
            skip: req => {
                return req.url.startsWith('/favicon.ico') || req.url.startsWith('/healthCheck.html');
            }
        }));

        // Add new socket connection to array
        io.sockets.on('connection', (socket) => {
            logger.info('A new socket.io connection detected');
            activeSocketConnections.push({socket: socket, alexa: null});
            
            // Register Alexa user ID with socket ID
            socket.on('registerAlexa', (data) => {
                activeSocketConnections.forEach( (connection, index) => {
                    if (connection.socket.id.replace('/#', '') === data.id) {
                        logger.info('Registered Alexa user ID with socket ID');
                        activeSocketConnections[index].alexa = data.alexa;
                    }
                });
            });
            
            // Remove disconnected socket from array
            socket.on('disconnect', () => {
                activeSocketConnections.forEach( (connection, index) => {
                    if (connection.socket.id === socket.id) {
                        logger.info('Socket.io socket disconnected');
                        activeSocketConnections.splice(index, 1);
                    }
                });
            });
        });

        mongoose.connect(config.database.dsn, function (err) {
            if (err) throw err;
            logger.info('Successfully connected to mongodb');
        });

        // The web UI will be available unless explicitly disabled.
        if (_.get(config, 'web.enabled', true)) {

            // Web Authentication
            if (_.get(config, 'web.auth_required')) {
                let basic = auth.basic({
                    realm: 'Davis',
                    file: `${__dirname}/app.htpasswd`
                });
                
                app.use(auth.connect(basic));
            }
            
            app.use(favicon(`${__dirname}/../web/favicon.ico`));
            app.use(express.static(`${__dirname}/../web`));
        }
    
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({extended: false}));
        app.use('/', routes);

        /**
         * Getting Git version
         */
        // version.init()
        //     .then( () => {
        //         logger.info('Successfully got Git version');
        //     });

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
    },

    push: function (davis) {
        logger.info('Pushing link');
        io.sockets.emit(`url-${davis.user.id}`, davis.exchange.response.visual.hyperlink);
    },
    
    isSocketConnected: function (user) {
        logger.info('Verifying user has active socket connection to Chrome Extension');
        let result = false;
        activeSocketConnections.forEach( connection => {
            if (connection.alexa === user.id) {
                result = true;
            }
        });
        return result;
    }
};