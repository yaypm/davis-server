'use strict';

require('../../../setup.js');
const chai = require('chai'),
    should = chai.should,
    expect = chai.expect,
    AlexaService = require('../../../../app/frontends/alexa/services/AlexaService'),
    alexaRequests = require('../../../fixtures/alexa');


describe('The Alexa frontend service', function() {

    it('should start a new conversation and exchange', function(done) {
        AlexaService.processRequest(alexaRequests.requests.launch, function(err, res){
            console.log(JSON.stringify(res));
            done();
        });
    });
});