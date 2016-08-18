'use strict';

require('../../setup.js');
const chai = require('chai'),
    expect = chai.expect,
    ConversationModel = require('../../../app/core/models/Conversation');

describe('The Conversation model', function() {
    it('should validate and throw if empty object is saved', function(done) {
        var conversation = new ConversationModel();
        conversation.save()
            .then( exchange => {
                expect(exchange).to.be.null;
                done();
            })
            .catch( err => {
                expect(err.name).to.equal('ValidationError');
                done();
            });
    });
});