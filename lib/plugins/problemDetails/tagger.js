'use strict';

const _ = require('lodash');

const ELIGIBLE_FOR_NOTIFICATIONS = ['system'];


function containsRootCause(problem) {
  return _.includes(problem.rankedEvents, event => event.isRootCause === true);
}

function eligibleToPushLink(exchange, isSocketConnected) {
    // WebUI and Alexa (with socket connection) is eligible for the show command.
  return _.get(exchange, 'source') === 'web' || (_.get(exchange, 'source') === 'alexa' && isSocketConnected);
}

function notification(exchange) {
  return _.includes(ELIGIBLE_FOR_NOTIFICATIONS, _.get(exchange, 'source'));
}

function getTense(exchange) {
  const context = exchange.getContext();
  return context.tense;
}

module.exports = {
  tag: (problem, exchange, isSocketConnected) =>
         ({
           tense: getTense(exchange),
           containsRootCause: containsRootCause(problem),
           eligibleToPushLink: eligibleToPushLink(exchange, isSocketConnected),
           notification: false,
         })
    ,
};
