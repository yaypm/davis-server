'use strict';

require('../setup.js');
var chai = require('chai');
var should = chai.should;
var expect = chai.expect;
var ConversationModel = require('../../app/models/Conversation');
var ExchangeModel = require('../../app/models/Exchange');

//Configured devices for conversation
var devices = [];

devices['amzn1.echo-sdk-account.AHIGWMSYVEQY5XIZIQNCTH5HZ5RW3JK43LUVBQEG6IM6B73UA5CLA'] = {
    userId: 'test1',
    type: 'alexa'
};

describe('The Conversation model', function() {

    it('should validate and throw if empty object is saved', function(done) {
        var conversation = new ConversationModel();
        conversation.save(function(err, res) {
            expect(err).to.be.not.null;
            expect(err.name).to.equal('ValidationError');
            done();
        });
    });
    it('should successfully save a conversation', function(done) {
        ConversationModel.findOne({
            userId: devices['amzn1.echo-sdk-account.AHIGWMSYVEQY5XIZIQNCTH5HZ5RW3JK43LUVBQEG6IM6B73UA5CLA'].userId
        }, function(err, res) {
            expect(err).to.be.null;
            expect(res).to.be.null;
            var conversation = new ConversationModel({
                userId: devices['amzn1.echo-sdk-account.AHIGWMSYVEQY5XIZIQNCTH5HZ5RW3JK43LUVBQEG6IM6B73UA5CLA'].userId
            });
            conversation.save(function(err, res) {
                expect(err).to.be.null;
                expect(res.userId).to.equal('test1');
                var exchange = new ExchangeModel({
                    _conversation: res._id,
                    source: 'alexa'
                });
                exchange.save(function(err, res) {
                    expect(err).to.be.null;
                    expect(res).to.be.not.null;
                    //We might want to include the conversation ID here
                    ExchangeModel
                        .findOne({
                            source: 'alexa'
                        })
                        .populate('_conversation')
                        .exec(function(err, res) {
                            expect(err).to.be.null;
                            expect(res._conversation.userId).to.equal('test1');
                            done();
                        });
                });

            });

        });
    });


});