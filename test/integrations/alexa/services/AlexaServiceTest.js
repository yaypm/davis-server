'use strict';

require('../../../setup.js');
const chai = require('chai'),
    should = chai.should,
    expect = chai.expect,
    AlexaService = require('../../../../app/integrations/alexa/services/AlexaService'),
    config = require('../../../config'),
    alexaRequests = require('../../../fixtures/alexa');


describe('The Alexa frontend service', function () {


    it('Should have an askDavis Method', function (done) {
        AlexaService(config).askDavis(alexaRequests.requests.launch)
            .then(response => {
                console.log(response);
                expect(response).to.be.not.null;
                expect(response.version).to.be.not.null;
                return done()
            })
            .catch(err => {
                return done(err);
            });
    }).timeout(55000);;

});