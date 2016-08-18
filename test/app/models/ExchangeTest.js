'use strict';

require('../../setup.js');
const chai = require('chai'),
    expect = chai.expect,
    ExchangeModel = require('../../../app/core/models/Exchange');

describe('The Exchange model', function() {
    it('should validate and throw if empty object is saved', function(done) {
        let exchange = new ExchangeModel();
        exchange.save()
        .then( exchange => {
            expect(exchange).to.be.null;
        })
        .catch( err => {
            expect(err.name).to.equal('ValidationError');
            done();
        });
    });
});