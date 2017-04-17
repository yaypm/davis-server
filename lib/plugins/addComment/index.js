'use strict';

class AddComment {
  constructor(davis, options) {
    this.davis = davis;
    this.options = options;

    this.intents = {
      addComment: {
        skipHelp: true,
        usage: 'Add a comment to a problem in Dynatrace',
        examples: [
          'Make a comment, I am working on this.',
          'Make a comment, I think this is related to the issue yesterday.',
          'Make a comment, This is a high priority issue.',
        ],
        phrases: [],
        regex: /^(add|make) ?a? comment:?,? (.*)/i,
        lifecycleEvents: [
          'addComment',
        ],
        clarification: 'I think you were trying to comment on an issue.',
      },
    };

    this.hooks = {
      'addComment:addComment': this.addComment.bind(this),
    };
  }

  addComment(exchange, context) {
    const raw = exchange.getRawRequest();
    const comment = raw.match(this.intents.addComment.regex)[2];

    if (context.lastIntent !== 'problemDetails') {
      exchange.response("I'm sorry, you can only do this from a problem detail response.");
      return;
    }

    return this.davis.dynatrace.addCommentToProblem(exchange, context.pid, comment)
      .then(() =>
          exchange
          .response(`I added your comment: ${comment}`)
          .skipFollowUp());
  }
}

module.exports = AddComment;
