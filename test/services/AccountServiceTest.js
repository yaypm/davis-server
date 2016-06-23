'use strict';

require('../setup.js');
var chai = require('chai');
var should = chai.should;
var expect = chai.expect;

var AccountService = require('../../app/services/AccountService');

describe('account validation', function() {
    describe('device validation', function() {
        it('should find an authorized device', function() {
            var user = AccountService.getUser('amzn1.echo-sdk-account.AHIGWMSYVEQY5XIZIQNCTH5HZ5RW3JK43LUVBQEG6IM6B73UA5CLA', 'alexa');
            expect(user.id).to.equal('beeme1mr');
        });
        
        it('should shouldnt find a user because the source is missing', function() {
            var user = AccountService.getUser('amzn1.echo-sdk-account.AHIGWMSYVEQY5XIZIQNCTH5HZ5RW3JK43LUVBQEG6IM6B73UA5CLA');
            expect(user).to.be.null;
        });
        
        it('should shouldnt find a user because the device id is invalid', function() {
            var user = AccountService.getUser('amzn1.echo-sdk-account.thisisinvalid', 'alexa');
            expect(user).to.be.null;
        });
        
        it('should shouldnt find a user because nothing was passed', function() {
            var user = AccountService.getUser();
            expect(user).to.be.null;
        });
    });
});