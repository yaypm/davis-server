'use strict';

let config = {
    port: process.env.PORT || 3000,
    ip: process.env.IP || '0.0.0.0',

    database: {
        dsn: 'localhost:27017'
    },
    watson: {
        enabled: true,
        stt: {
            user: '123456',
            password: '123456789'
        },
        tts: {
            user: '123456',
            password: '123456789'
        }
    },

    slack: {
        enabled: true,
        key: '123456789'
    },

    users: [{
        id: '<user_id>',
        name: {
            first: '<first_name>',
            last: '<last_name>'
        },
        alexa: ['<alexa_token>'],
        timezone: 'America/Detroit',
        lang: 'en-us',
        ruxit: {
            token: '<ruxit_token>',
            url: '<tenant_url>'
        },
        nlp: {
            wit: '<wit_token>'
        }
    }]

};

config.aliases = require('./aliases');

module.exports = config;