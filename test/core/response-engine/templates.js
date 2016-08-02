'use strict';

require('../../setup.js');
const   BbPromise = require('bluebird'),
    fs = BbPromise.promisifyAll(require('fs')),
    nunjucks = require('../../../app/core/response-engine/response-builder/nunjucks');

describe('Tests the template engine', function() {
    it('should dynamically load in the appropriate templates', function(done) {
        fs.readFileAsync('./logs/template_builder/test.txt')
            .then(data => {
                data = JSON.parse(data);
                const template =  data.template.text,
                    davis = data.davis;

                return nunjucks(davis.config.aliases).renderAsync(template, davis)
            })
            .then(response => {
                console.log(response);
                done();
            })
            .catch(err => {
                done(err);
            })
    });
});