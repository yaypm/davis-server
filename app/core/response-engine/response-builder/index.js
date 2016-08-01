'use strict';

const _ = require('lodash'),
    BbPromise = require('bluebird'),
    fs = BbPromise.promisifyAll(require('fs')),
    nunjucks = require('./nunjucks'),
    path = require('path'),
    greeter = require('./greeter'),
    logger = require('../../../utils/logger');

const NUNJUCK_EXTENSION = '.nj',
    RESERVED_FOLDER_NAMES = {
        say: ['audible', 'auditory', 'say'],
        show: ['visual', 'show']
    };

module.exports = {
    build: (davis, relativeTemplatePath, shouldGreet, followUp) => {
        relativeTemplatePath = path.join(relativeTemplatePath);
        shouldGreet = shouldGreet || true;
        return new BbPromise((resolve, reject) => {
            getFiles(relativeTemplatePath)
                .then(files => {
                    const sayTemplate = findAdditionalTemplates(relativeTemplatePath, files, RESERVED_FOLDER_NAMES.say),
                        textTemplate = randomNunjuckTemplate(relativeTemplatePath, files),
                        showTemplate = findAdditionalTemplates(relativeTemplatePath, files, RESERVED_FOLDER_NAMES.show);
                    return [sayTemplate, textTemplate, showTemplate];
                })
                .spread((say, text, show) => {
                    const greetingResponse = (shouldGreet) ? getGreeting(davis) : null,
                        sayResponse = (!_.isNil(say)) ? nunjucks(davis.config.aliases).renderAsync(say, davis) : null,
                        textResponse = (!_.isNil(text)) ? nunjucks(davis.config.aliases).renderAsync(text, davis): null,
                        showResponse = (!_.isNil(show)) ? nunjucks(davis.config.aliases).renderAsync(show, davis) : null;
                    return [greetingResponse, sayResponse, textResponse, showResponse];
                })
                .spread((greeting, say, text, show) => {
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
    }
};

function getGreeting(davis) {
    return new BbPromise((resolve, reject) => {
        greeter.greet(davis).then(relativeTemplatePath => {
            if (_.isEmpty(relativeTemplatePath)) {
                return resolve(null);
            } else {
                return getFiles(relativeTemplatePath)
                    .then(files => {
                        return nunjucks(davis.config.aliases).renderAsync(randomNunjuckTemplate(relativeTemplatePath, files), davis);
                    })
                    .then(greeting => {
                        return resolve(greeting);
                    })
                    .catch(err => {
                        return reject(err);
                    });
            }
        });
    })

}

function combinedResponse(greet, body, followUp) {
    if (_.isNil(body)) {
        return body
    } else {
        let response = (greet) ? `${greet}  ` : '';
        response = `${response}${body}`;
        return (followUp) ? `${response}  ${followUp}` : response;
    }
}

function getFullPath(relativeTemplatePath) {
    return path.join(__dirname, '..', relativeTemplatePath);
}

function getFiles(relativeTemplatePath) {
    const fullPath = getFullPath(relativeTemplatePath);
    return fs.readdirAsync(fullPath);
}

function findAdditionalTemplates(relativeTemplatePath, files, reserved_folders) {
    const fullPath = getFullPath(relativeTemplatePath),
        matches = _.intersection(files, reserved_folders);

    if (!_.isEmpty(matches)) {
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
 * @param {string} templatePath - The relative path to the templates
 * @param {Object} files - The list of files and folders returned from fs.
 * @returns {Object} - The filtered list of Nunjuck templates.
 */
function randomNunjuckTemplate(templatePath, files) {
    const filteredTemplateList = _.filter(files, file => {return _.endsWith(file, NUNJUCK_EXTENSION);});

    if (filteredTemplateList.length === 0) {
        logger.error('Unable to find a template!');
        return new Error('Unable to find template.');
    } else {
        return path.join(templatePath, _.sample(filteredTemplateList));
    }
}