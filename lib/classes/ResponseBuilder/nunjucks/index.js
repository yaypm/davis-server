'use strict';

module.exports = function Nunjucks(aliases) {

    const nunjucks = require('nunjucks'),
        env = new nunjucks.Environment({
            autoescape: false,
            trimBlocks: true,
            lstripBlocks: true
        });

    require('./filters')(env, aliases);
    return env;
};
