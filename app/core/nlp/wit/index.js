'use strict';

const rp = require('request-promise'),
    _ = require('lodash');

class Wit {
    /**
     * WIT.AI API
     * @constructs Wit
     * @param {string} token - The API token required for WIT.AI calls.
     * @param {string} [version=20160616] - The version of the API you would like to use.
     */
    constructor(token, version) {
        console.log('creating a wit object');
        if (typeof token === 'undefined'){
            throw new Error('You must provide an API token for Wit!');
        }
        this.token = token;
        this.version = version || '20160616';
    }

    /**
     * Returns a process phrase object from WIT
     * @param {string} phrase - The phrase initiated by the user.
     * @param {Object} context - The context in which WIT should process the request.
     * @returns {Promise}
     */
    ask(phrase, context) {
        if (!_.isString(phrase) || phrase.length > 256)
            throw new Error('You can only phrases as strings shorter than 256 characters!');

        let options = {
            uri: 'https://api.wit.ai/message',
            qs: {
                q: phrase,
                context: context
            },
            headers: {
                Authorization: 'Bearer ' + this.token,
                Accept: 'application/vnd.wit.' + this.version
            },
            json: true
        };

        return rp(options);
    }
}

module.exports = Wit;