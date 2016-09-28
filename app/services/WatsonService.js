'use strict';

const vcapServices = require('vcap_services'),
    _ = require('lodash'),
    watson = require('watson-developer-cloud'),
    BbPromise = require('bluebird');

const WATSON_API_VERSION = 'v1',
    WATSON_STREAM_API_URL = 'https://stream.watsonplatform.net';


module.exports = function WatsonService(config) {

    const ttsConfig = _.assign({
        version: WATSON_API_VERSION,
        url: `${WATSON_STREAM_API_URL}/text-to-speech/api`,
        username: config.watson.tts.user,
        password: config.watson.tts.password
    }, vcapServices.getCredentials('text_to_speech'));

    const sttConfig = _.assign({
        version: WATSON_API_VERSION,
        url: `${WATSON_STREAM_API_URL}/speech-to-text/api`,
        username: config.watson.stt.user,
        password: config.watson.stt.password
    }, vcapServices.getCredentials('speech_to_text'));

    const ttsAuthService = watson.authorization(ttsConfig),
        sttAuthService = watson.authorization(sttConfig);


    return {
        getTtsToken() {
            return new BbPromise((resolve, reject) => {
                if (!config.watson.enabled) return reject(new Error('Watons TTS is disabled.'));
                ttsAuthService.getToken({url: ttsConfig.url}, (err, token) => {
                    if(err) return reject(err);

                    return resolve(token);
                });
            });
        },

        getSttToken() {
            return new BbPromise((resolve, reject) => {
                if (!config.watson.enabled) return reject(new Error('Watons STT is disabled.'));
                sttAuthService.getToken({url: sttConfig.url}, (err, token) => {
                    if(err) return reject(err);

                    return resolve(token);
                });
            });
        }
    };
};


