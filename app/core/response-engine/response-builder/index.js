'use strict';

const _ = require('lodash'),
    BbPromise = require('bluebird'),
    fs = BbPromise.promisifyAll(require('fs')),
    nunjucks = require('../nunjucks/index'),
    path = require('path'),
    logger = require('../../../utils/logger');

const NUNJUCK_EXTENTION = '.nj',
    RESERVED_FOLDER_NAMES = {
        say: ['audible', 'auditory', 'say'],
        show: ['visual', 'show']
    };

module.exports = {
    build: (davis, greeting, relativeTemplatePath, followUp) => {
        return new BbPromise((resolve, reject) => {
            getFiles(relativeTemplatePath)
                .then(files => {
                    const sayTemplate = findAdditionalTemplates(relativeTemplatePath, files, RESERVED_FOLDER_NAMES.say),
                        textTemplate = randomNunjuckTemplate(relativeTemplatePath, files),
                        showTemplate = findAdditionalTemplates(relativeTemplatePath, files, RESERVED_FOLDER_NAMES.show);
                    return [sayTemplate, textTemplate, showTemplate];
                })
                .spread((say, text, show) => {
                    const sayResponse = (!_.isNil(say)) ? nunjucks(davis.config.aliases).renderAsync(say, davis) : null,
                        textResponse = (!_.isNil(text)) ? nunjucks(davis.config.aliases).renderAsync(text, davis): null,
                        showResponse = (!_.isNil(show)) ? nunjucks(davis.config.aliases).renderAsync(show, davis) : null;
                    return [sayResponse, textResponse, showResponse];
                })
                .spread((say, text, show) => {
                    davis.exchange.response.audible.ssml = combinedResponse(greeting, say, followUp);
                    davis.exchange.response.visual.text = combinedResponse(greeting, text, followUp);
                    davis.exchange.response.visual.html = combinedResponse(greeting, show, followUp);
                    return resolve(davis);
                })
                .catch(err => {
                    logger.error(`Unable to get a templates: ${err.message}`);
                    return reject(err);
                });
        });
    },

    individual: (relativeTemplatePath, davis) => {
        return new BbPromise((resolve, reject) => {
            getFiles(relativeTemplatePath)
                .then(files => {
                    return randomNunjuckTemplate(relativeTemplatePath, files)
                })
                .then(templatePath => {
                    return nunjucks(davis.config.aliases).renderAsync(templatePath, davis)
                })
                .then(response => {
                    return resolve(response);
                })
                .catch(err => {
                    logger.error(`Unable to build an individual response: ${err.message}`);
                    reject(err);
                })
        })
    }
};

function combinedResponse(greet, body, followUp) {
    if (_.isNil(body)) {
        return body
    } else {
        let response = (!!greet) ? `${greet}  ` : '';
        response = `${response}${body}`;
        return (!!followUp) ? `${response}  ${followUp}` : response;
    }
}

function getFiles(relativeTemplatePath) {
    const fullPath = path.join(__dirname, '..', relativeTemplatePath);
    return fs.readdirAsync(fullPath);
}

function findAdditionalTemplates(relativeTemplatePath, files, reserved_folders) {
    const fullPath = path.join(__dirname, '..', relativeTemplatePath),
        matches = _.intersection(files, reserved_folders);

    if (_.isEmpty(matches)) {
        return;
    } else {
        return new BbPromise((resolve, reject) => {
            const folder = _.head(matches),
                templatePath = path.join(fullPath, folder);
            fs.readdirAsync(templatePath)
                .then(files => {
                    return resolve(randomNunjuckTemplate(path.join(relativeTemplatePath, folder), files))
                })
                .catch(err => {
                    reject(err);
                })
        })
    }
}

/**
 * Filters a list of of files by looking for a specific Nunjuck extention
 * @param {Object} files - The list of files and folders returned from fs.
 * @returns {Object} - The filtered list of Nunjuck templates.
 */
function randomNunjuckTemplate(templatePath, files) {
    const filteredTemplateList = _.filter(files, file => {return _.endsWith(file, NUNJUCK_EXTENTION);});

    if (filteredTemplateList.length === 0) {
        logger.error('Unable to find a template!');
        return new Error('Unable to find template.');
    } else {
        return path.join(templatePath, _.sample(filteredTemplateList));
    }
}