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
        return new BbPromise((resolve, reject) => {
            pathToTemplates(this.exchange.template.path)
                .then(templates => {

                    let templateProps = {};
                    _.forEach(templates, (value, key) => {
                        templateProps[key] = (!_.isNil(value)) ? nunjucks.renderAsync(value, this) : null;
                    });
                    return BbPromise.props(templateProps);
                })
                .then(rendered => {
                    logger.debug('Setting rendered text to Davis response.');
                    this.exchange.response.say.ssml = rendered.say;
                    this.exchange.response.show.text = rendered.base;
                    this.exchange.response.show.html = rendered.show;
                    return resolve(this);
                })
                .catch(err => {
                    logger.error('An error occurred generating a response from a template.');
                    return reject(err);
                });
        });
    }
}

/**
 * Creates an object containing paths to approprate templates
 * @param {string} basePath - The base path starting at the root of the templates folder
 * @returns {Object} templates
 */
function pathToTemplates(basePath) {
    logger.info('Creating file paths to approprate templates');
    let templates = {},
        templatePath = path.join(__dirname, basePath);

    return new BbPromise((resolve, reject) => {
        fs.readdirAsync(templatePath)
        .then(files => {
            templates.base = joinPaths(basePath, files);

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
            templates[SPEECH_FOLDER_NAME] = joinPaths(basePath, speechFiles, SPEECH_FOLDER_NAME);
            templates[SHOW_FOLDER_NAME] = joinPaths(basePath, showFiles, SHOW_FOLDER_NAME);
            return resolve(templates);
        })
        .catch(err => {
            logger.error('Something went wrong attempting to resolve the template paths!');
            return reject(err);
        });
    });
}

/**
 * Helps build file paths to templates
 * @param {string} basePath - The base path starting at the root of the templates folder
 * @param {Object} files - The list of files return by fs.readdir.
 * @param {string} [folder=''] - An optional folder used for specific response types (I.E. say or show).
 * @returns {string} jointedPath
 */
function joinPaths(basePath, files, folder) {
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