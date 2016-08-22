'use strict';

const chai = require('chai'),
    expect = chai.expect,
    nunjucks = require('../../../../../app/core/response-engine/response-builder/nunjucks');

describe('Tests the greetings templates', function() {
    let davis;
    beforeEach(function() {
        davis = {
            config: {
                aliases: require('../../../../mock_data/davis/aliases')
            },
            user: {
                name: {
                    first: 'test'
                }
            }
        };
    });

    describe('Tests welcome back', function() {
        const template = 'response-builder/greeter/templates/en-us/lastInteraction/yesterday/welcomeBack.nj';


        it('should greet the user by name', function(done) {
            nunjucks(davis.config.aliases).renderAsync(template, davis)
                .then(response => {
                    console.log(response);
                    expect(response).to.contain('Test');
                    done();
                })
                .catch(err => {
                    done(err);
                });
        });

        it('should greet the user in a generic way', function(done) {
            delete davis.user.name;
            nunjucks(davis.config.aliases).renderAsync(template, davis)
                .then(response => {
                    console.log(response);
                    expect(response).to.contain('there');
                    done();
                })
                .catch(err => {
                    done(err);
                });
        });
    });

    describe('Tests good morning', function() {
        const template = 'response-builder/greeter/templates/en-us/lastInteraction/hours/morning/goodMorning.nj';


        it('should greet the user by name', function(done) {
            nunjucks(davis.config.aliases).renderAsync(template, davis)
                .then(response => {
                    console.log(response);
                    expect(response).to.contain('Test');
                    done();
                })
                .catch(err => {
                    done(err);
                });
        });

        it('should greet the user in a generic way', function(done) {
            delete davis.user.name;
            nunjucks(davis.config.aliases).renderAsync(template, davis)
                .then(response => {
                    console.log(response);
                    expect(response).to.contain('Good morning!');
                    done();
                })
                .catch(err => {
                    done(err);
                });
        });
    });
});