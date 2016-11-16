'use strict';

const express = require('express'); // eslint-disable-line import/newline-after-import
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const bodyParser = require('body-parser');
const favicon = require('serve-favicon');
const path = require('path');
const BbPromise = require('bluebird');
const routes = require('./routes');
const verifier = require('alexa-verifier');

class Server {
  constructor(davis) {
    this.davis = davis;
    this.io = io;
    this.server = server;
    this.app = app;
    this.express = express;

    this.activeSocketConnections = [];
  }

  manageSocketConnections() {
    this.io.sockets.on('connection', socket => {
      this.davis.logger.debug('Detected a new socket connection.');
      this.activeSocketConnections.push({ socket, alexa: null });

      socket.on('registerAlexa', data => {
        this.davis.logger.debug(
          `Processing a register Alexa event from a user with the ID of ${data.id}`
        );
        this.activeSocketConnections.forEach((connection, index) => {
          if (connection.socket.id.replace('/#', '') === data.id) {
            this.activeSocketConnections[index].alexa = data.alexa;
          }
        });
      });

      socket.on('disconnect', () => {
        this.davis.logger.debug('A socket connection was lost.');
        this.activeSocketConnections.forEach((connection, index) => {
          if (connection.socket.id === socket.id) {
            this.activeSocketConnections.splice(index, 1);
          }
        });
      });
    });
  }

  isSocketConnected(user) {
    let result = false;
    this.activeSocketConnections.forEach(connection => {
      if (connection.alexa === user.id) {
        result = true;
      }
    });
    return result;
  }

  pushLinkToUser(user, link) {
    this.io.sockets.emit(`url-${user.id}`, link);
  }

  start() {
    return new BbPromise.resolve().then(() => {
      // Attaching the davis object to Express
      this.app.set('davis', this.davis);

      // Alexa validation must be done before the middleware JSON parser
      this.app.use((req, res, next) => {
        // if production and windows => fail 401
        if (process.env.NODE_ENV === 'production' && process.platform === 'win32') {
          this.davis.logger.error('Cannot validate alexa requests on win32');
          req.status(401).json({ status: 'failure', reason: 'Cannot validate Alexa requests on Windows.' });
          return;
        }

        // only validate requests with signaturecertchainurl header
        if (!req.headers.signaturecertchainurl) {
          next();
          return;
        }

        // do not verify alexa requests in development
        if (process.env.NODE_ENV !== 'production') {
          this.davis.logger.debug('Alexa verification skipped outside production');
          req.alexaVerified = true;
          next();
          return;
        }

        req._body = true;
        req.rawBody = '';
        req.on('data', data => {
          req.rawBody += data;
          return req.rawBody;
        });
        req.on('end', () => {
          try {
            req.body = JSON.parse(req.rawBody);
          } catch (error) {
            this.davis.logger.error(error);
            req.body = {};
          }
          const certUrl = req.headers.signaturecertchainurl;
          const signature = req.headers.signature;
          const requestBody = req.rawBody;
          verifier(certUrl, signature, requestBody, er => {
            if (er) {
              this.davis.logger.error('error validating the alexa cert:', er);
              res.status(401).json({ status: 'failure', reason: er });
            } else {
              req.alexaVerified = true;
              next();
            }
          });
        });
      });

      // Configuring the middleware JSON parser
      this.app.use(bodyParser.json());
      this.app.use(bodyParser.urlencoded({ extended: false }));

      // Defining static content and routes
      this.app.use(favicon(path.join(__dirname, '../../web/favicon.ico')));
      this.app.use(express.static(path.join(__dirname, '../../web')));
      this.app.use('/', routes);

      // Setting up the socket.io connection
      this.manageSocketConnections();

      const port = this.davis.config.getDavisPort();

      // Starting the server
      this.server.listen(port, () => {
        this.davis.logger.info(`Davis server is now listening on port ${port}.`);
      });
    });
  }

}

module.exports = Server;
