'use strict';

const BbPromise = require('bluebird'),
    nunjucks = BbPromise.promisifyAll(require('nunjucks')),
    env = new nunjucks.Environment(
            new nunjucks.FileSystemLoader(__dirname),{
                autoescape: false,
                trimBlocks: true,
                lstripBlocks: true}
        );

// Loading in custom filters
require('./filters')(env);

module.exports = env;