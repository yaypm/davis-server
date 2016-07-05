'use strict';

const nunjucks = require('./nunjucks'),
    BbPromise = require('bluebird'),
    fs = BbPromise.promisifyAll(require('fs')),
    path = require('path'),
    _ = require('lodash'),
    logger = require('../../../utils/logger');

const SPEECH_FOLDER_NAME = 'say',
    SHOW_FOLDER_NAME = 'show',
    NUNJUCK_EXTENTION = '.nj';

class Templates {
    /**
     * TemplateEngine
     * @constructs Templates
     * @param {object} davis - The davis object containing user, exchange, and conversertion details
     */
    constructor(davis) {
        Object.assign(this, davis);
    }


    /**
     * Finds and processes templates based on rule metadata
     * @returns {Object} Promise - Returns a promise that resolves to an updated exchange
     */
    buildResponse() {
        //return pathToTemplates(this.exchange.template.path);
        return new BbPromise((resolve, reject) => {

            let basePath = this.exchange.template.path,
                templatePath = path.join(__dirname, basePath);

            pathToTemplates(this.exchange.template.path)
            .then(templates => {
                console.log(templates);
                
                // ToDo build props automatically
                return BbPromise.props({
                    base: nunjucks.renderAsync(templates.base, this),
                    say: nunjucks.renderAsync(templates.say, this)//,
                    //show: nunjucks.renderAsync(templates.show, this)
                });
            })
            .then(rendered => {
                console.log(rendered);
                return resolve();
            })
            .catch(err => {
                logger.error('An error occurred generating a response from a template.');
                return reject(err);
            });
        });
    }
}

function pathToTemplates(basePath) {
    logger.info('Creating file paths to approprate templates');
    let templates = {},
        templatePath = path.join(__dirname, basePath);

    return new BbPromise((resolve, reject) => {
        fs.readdirAsync(templatePath)
        .then(files => {
            templates.base = joinPaths(basePath, null, files);

            let additionalTemplates = [];
            // Handles automatically including speech related responses if available
            if (_.includes(files, SPEECH_FOLDER_NAME)) {
                logger.debug('Found speech specific templates to use');
                additionalTemplates.push(fs.readdirAsync(path.join(templatePath, SPEECH_FOLDER_NAME)));
            } else {
                additionalTemplates.push(null);
            }

            // Handles automatically including content that would be displayed to the user
            if (_.includes(files, SHOW_FOLDER_NAME)) {
                logger.debug('Found show specific templates to use');
                additionalTemplates.push(fs.readdirAsync(path.join(templatePath, SHOW_FOLDER_NAME)));
            } else {
                additionalTemplates.push(null);
            }
            return additionalTemplates;
        })
        .spread((speechFiles, showFiles) => {
            templates[SPEECH_FOLDER_NAME] = joinPaths(basePath, SPEECH_FOLDER_NAME, speechFiles);
            templates[SHOW_FOLDER_NAME] = joinPaths(basePath, SHOW_FOLDER_NAME, showFiles);
            return resolve(templates);
        })
        .catch(err => {
            logger.error('Something went wrong attempting to resolve the template paths!');
            return reject(err);
        });
    });
}

function joinPaths(basePath, folder, files) {
    folder = folder || '';

    let joinedPath = null,
        template = randomNunjuckTemplate(files);
    
    if (_.isString(template)) {
        joinedPath = path.join(basePath, folder, randomNunjuckTemplate(files));
    } else {
        logger.warn(`Unable to find a valid template in the following path: ${path.join(basePath, folder)}`);
    }

    return joinedPath;
}

/**
 * Filters a list of of files by looking for a specific Nunjuck extention
 * @param {Object} files - The list of files and folders returned from fs.
 * @returns {Object} - The filtered list of Nunjuck templates.
 */
function randomNunjuckTemplate(files) {
    return _.sample(_.filter(files, file => { return _.endsWith(file, NUNJUCK_EXTENTION);}));
}

module.exports = Templates;