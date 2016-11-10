'use strict';

// Seconds of inactivity until Davis goes to sleep
const INACTIVITY_TIMEOUT = 30;

const SLACK_REQUEST_SOURCE = 'slack';

const ERROR_MESSAGE = 'Sorry about that, I\'m having issues responding to your request at this time.';

// Listening States
const STATES = {
  LISTENING: {
    ICON: 'https://s3.amazonaws.com/dynatrace-davis/assets/images/green-dot.png',
    TEXT: 'Listening',
  },
  SLEEPING: {
    ICON: 'https://s3.amazonaws.com/dynatrace-davis/assets/images/grey-dot.png',
    TEXT: 'Wake me by saying "Hey Davis"',
  },
  RESPONDED: {
    ICON: 'https://s3.amazonaws.com/dynatrace-davis/assets/images/grey-dot.png',
    TEXT: 'Responded',
  },
};

// Launch phrases
const PHRASES = [
  '^hey davis',
  '^hey, davis',
  '^okay davis',
  '^okay, davis',
  '^ok davis',
  '^ok, davis',
  '^hi davis',
  '^hi, davis',
  '^yo davis',
  '^yo, davis',
  '^launch davis',
  '^ask davis',
];

module.exports = {
  INACTIVITY_TIMEOUT,
  SLACK_REQUEST_SOURCE,
  ERROR_MESSAGE,
  STATES,
  PHRASES,
};
