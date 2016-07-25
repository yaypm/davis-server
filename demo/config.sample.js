'use strict';

let config = {
    port: process.env.PORT || 3000,
    ip: process.env.IP || '0.0.0.0',

    database: {
        dsn: '<mongodb_database_dsn>'
    },
    watson: {
        enabled: true,
        stt: {
            user: '<watson_stt_user_name>',
            password: '<watson_stt_password>'
        },
        tts: {
            user: '<watson_tts_user_name>',
            password: '<watson_tts_password>'
        }
    },

    slack: {
        enabled: true,
        key: '<slack_token>'
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
    }],

};

config.aliases = require('./aliases');

module.exports = config;