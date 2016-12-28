const _ = require('lodash');

function removeButtons(message) {
  const attachments = _.filter(message.attachments, a => !_.has(a, 'callback_id'));
  const newMessage = _.assign({}, message);
  newMessage.attachments = attachments;
  return newMessage;
}

module.exports = {
  removeButtons,
};

