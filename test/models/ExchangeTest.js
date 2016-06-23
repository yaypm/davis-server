'use strict';

require('../setup.js');
const chai = require('chai'),
    should = chai.should,
    expect = chai.expect,
    ExchangeModel = require('../../app/core/models/Exchange');

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