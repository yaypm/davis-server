'use strict';

const BbPromise = require('bluebird'),
    path = require('path'),
    nunjucks = BbPromise.promisifyAll(require('nunjucks')),
    env = new nunjucks.Environment(
            new nunjucks.FileSystemLoader(path.join(__dirname, '..', 'intents')),{
                autoescape: false,
                trimBlocks: true,
                lstripBlocks: true}
        );

// Loading in custom filters
require('./filters')(env);

module.exports = env;