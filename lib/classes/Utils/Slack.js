'use strict';

const _ = require('lodash');

function removeButtons(message, user, action) {
  const attachments = _.map(message.attachments, (a) =>
      (!_.has(a, 'callback_id')) ? a : { text: `<@${user}> clicked button "${action}"` });
  const newMessage = _.assign({}, message);
  newMessage.attachments = attachments;
  return newMessage;
}

module.exports = {
  removeButtons,
};

