'use strict';

require('../setup.js');
var chai = require('chai');
var should = chai.should;
var expect = chai.expect;
var config = require('../config');

var WatsonService = require('../../app/services/WatsonService');

describe('The module', function () {
    it('should return a function', function (done) {

        let watsonService = WatsonService(config);
        expect(watsonService.getSttToken).to.exist;
        expect(watsonService.getTtsToken()).to.exist
        done();

    });
});

describe('The Service', function () {

    it('should return a valid ttstoken', function (done) {

        WatsonService(config).getTtsToken()
            .then(token => {
                expect(token).to.be.not.null;
                done();
            })
            .catch(err => {
                done(err);
            });
    });

    it('should return a valid stttoken', function (done) {

        WatsonService(config).getSttToken()
            .then(token => {
                expect(token).to.be.not.null;
                done();
            })
            .catch(err => {
                done(err);
            });
    });
});