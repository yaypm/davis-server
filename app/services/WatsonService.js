'use strict';

const vcapServices = require('vcap_services'),
    _ = require('lodash'),
    watson = require('watson-developer-cloud'),
    BbPromise = require('bluebird'),
    config = require('config');

console.log(config);

const WATSON_API_VERSION = 'v1',
    WATSON_STREAM_API_URL = 'https://stream.watsonplatform.net';

let ttsConfig = _.assign({
    version: WATSON_API_VERSION,
    url: `${WATSON_STREAM_API_URL}/text-to-speech/api`,
    username: config.get('watson.tts.user'),
    password: config.get('watson.tts.password')
}, vcapServices.getCredentials('text_to_speech'));

let sttConfig = _.assign({
    version: WATSON_API_VERSION,
    url: `${WATSON_STREAM_API_URL}/speech-to-text/api`,
    username: config.get('watson.stt.user'),
    password: config.get('watson.stt.password')
}, vcapServices.getCredentials('speech_to_text'));

let ttsAuthService = watson.authorization(ttsConfig),
    sttAuthService = watson.authorization(sttConfig);
    

const WatsonService = {
    getTtsToken() {
        return new BbPromise((resolve, reject) => {
            ttsAuthService.getToken({url: ttsConfig.url}, (err, token) => {
                if(err) return reject(err);

                return resolve(token);
            });
        });
    },

    getSttToken() {
        return new BbPromise((resolve, reject) => {
            sttAuthService.getToken({url: sttConfig.url}, (err, token) => {
                if(err) return reject(err);

                return resolve(token);
            });
        });
    }
};

module.exports = WatsonService;