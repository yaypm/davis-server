'use strict';

let config = {
    port: process.env.PORT || 3000,
    ip: process.env.IP || '0.0.0.0',

    database: {
        dsn: '127.0.0.1:27017/davis-dev'
    },

    nlp: {
        wit: '6XTDF735VR2KUDVYTEOZZLIWHYOTDJXX'
    },

    watson: {
        enabled: true,
        stt: {
            user: '09199b6b-e2e2-4004-9f03-2dc969c72423',
            password: 'pddWNCsnhfMS'
        },
        tts: {
            user: '9ab1ce19-a8dd-4d08-8508-a2d1f6aeeec0',
            password: 'Fbsw5iGZui5v'
        }
    },

    slack: {
        enabled: true,
        key: 'xoxb-68892415622-O2tO923rbcPHEFv8olH1tfV7',
        timezone: 'America/Detroit',
        lang: 'en-us',
        dynatrace: {
            // token: 'KiHjXbwXSsqh0j1CfvpUt',
            // url: 'https://xmp34331.live.dynatrace.com',
            token: '1ZzKHTVvTrapclq-vnASE',
            url: 'https://cdojfgmpzd.live.dynatrace.com',
            strictSSL: false
        }
    },

    web: {
        enabled: true,
        lang: 'en-us',
        dynatrace: {
            token: '1ZzKHTVvTrapclq-vnASE',
            url: 'https://cdojfgmpzd.live.dynatrace.com',
            ////token: 'xD9-wgbXRE6b5r39AYq2A',
            ////url: 'https://deve2e.dev.dynatracelabs.com',
            // token: '1ZzKHTVvTrapclq-vnASE',
            // url: 'https://cdojfgmpzd.live.dynatrace.com',
            strictSSL: false
        }
    },

    users: [{
        id: 'cwoolf',
        name: {
            first: 'Cory',
            last: 'Woolf'
        },
        alexa: ['amzn1.ask.account.AFP3ZWPOS2BGJR7OWJZ3DHPKMOMNWY4AY66FUR7ILBWANIHQN73QG3XG36BP66IRMGPCA2NHI25J6RRDEYJT6GOKIWQJT6ZU4LBZJAFDIAW4XAUZPGOBSTQFVVBFAM6VASSDHJEYYCRFQSJAMELURIHTUZEGXG3JYCXIGFNXF7YMTYGAYI3S3R7FGUKNNJLWDR2CKCD4YR7T2DI'],
        timezone: 'America/Detroit',
        lang: 'en-us',
        dynatrace: {
            token: 'xD9-wgbXRE6b5r39AYq2A',
            url: 'https://deve2e.dev.dynatracelabs.com',
            strictSSL: false
        }
    }]
};

config.aliases = require('./aliases');

module.exports = config;