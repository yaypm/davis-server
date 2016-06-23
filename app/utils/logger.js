'use strict';

const winston = require('winston');
winston.emitErrs = true;

const logger = new winston.Logger({
    transports: [
        new winston.transports.Console({
            level: 'debug',
            handleExceptions: true,
            json: false,
            colorize: true
        })
    ],
    exitOnError: false
});

// Suppresses loggin during Mocha tests.
//if (process.env.NODE_ENV === 'test') logger.remove(winston.transports.Console);

module.exports = logger;
module.exports.stream = {
    write: message => {
        logger.info(message);
    }
};