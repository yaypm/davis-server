'use strict';

module.exports = function Nunjucks(aliases) {

    const BbPromise = require('bluebird'),
        path = require('path'),
        nunjucks = BbPromise.promisifyAll(require('nunjucks')),
        env = new nunjucks.Environment(
            new nunjucks.FileSystemLoader(path.join(__dirname, '..')), {
                autoescape: false,
                trimBlocks: true,
                lstripBlocks: true
            }
        );

    require('./filters')(env, aliases);
    return env;
};
