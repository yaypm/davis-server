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
    return new BbPromise(resolve => {
      // Attaching the davis object to Express
      this.app.set('davis', this.davis);

      // Configuring the middleware JSON parser
      this.app.use(bodyParser.json());
      this.app.use(bodyParser.urlencoded({ extended: false }));

      // Defining static content and routes
      this.app.use(favicon(path.join(__dirname, '../../web/favicon.ico')));
      this.app.use(express.static(path.join(__dirname, '../../web')));
      this.app.use('/', routes);

      // Setting up the socket.io connection
      this.manageSocketConnections();

      const ip = this.davis.config.getDavisIP();
      const port = this.davis.config.getDavisPort();

      // Starting the server
      this.server.listen(port, ip, () => {
        this.davis.logger.info(`Davis server is now listening at http://${ip}:${port}`);
        resolve();
      });
    });
  }

}

module.exports = Server;
