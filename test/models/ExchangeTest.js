'use strict';

require('../setup.js');
var chai = require('chai');
var should = chai.should;
var expect = chai.expect;
var ExchangeModel = require('../../app/models/Exchange');

describe('The Exchange model', function() {
    
    it('should validate and throw if empty object is saved', function(done) {
        var exchange = new ExchangeModel();
        exchange.save(function(err, res) {
            expect(err).to.be.not.null;
            expect(err.name).to.equal('ValidationError');
            done();
        });
    });
    it('should successfully save an exchange', function(done) {
        var exchange = new ExchangeModel({source: 'alexa'});
        exchange.save(function(err, res) {
            expect(res).to.be.not.null;
            done();
        });
    });
    
    
});