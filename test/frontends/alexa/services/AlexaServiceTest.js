'use strict';

require('../../../setup.js');
var chai = require('chai');
var should = chai.should;
var expect = chai.expect;
var AlexaService = require('../../../../app/frontends/alexa/services/AlexaService');
var alexaRequests = require('../../../fixtures/alexa');


describe('The Alexa frontend service', function() {

    it('should start a new conversation and exchange', function(done) {
        AlexaService.processRequest(alexaRequests.requests.launch, function(err, res){
            console.log(JSON.stringify(res));
            done();
        });
    });
});