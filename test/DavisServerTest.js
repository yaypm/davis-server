'use strict';

const chai = require('chai'),
    should = chai.should,
    expect = chai.expect,
    DavisServer = require('../DavisServer'),
    config = require('./config');


describe("The davis server", function () {

    const davisServer = new DavisServer(config);

    it('Should be a class instance of DavisServer', function (done) {
        expect(davisServer).to.be.an.instanceof(DavisServer);
        return done();

    });

    it('Should have a run method that returns an express app object', function (done) {
        const app = davisServer.run(function(app) {
            expect(app.mountpath).to.exist;
            return done();
        });


    });
});