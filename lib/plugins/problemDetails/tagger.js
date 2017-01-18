'use strict';

const _ = require('lodash');

function containsRootCause(problem) {
  return _.includes(problem.rankedEvents, event => event.isRootCause === true);
}

function eligibleToPushLink(exchange, isSocketConnected) {
  // WebUI and Alexa (with socket connection) is eligible for the show command.
  const source = exchange.getRequestSource().trim().toLowerCase();
  return ((source === 'web' || source === 'alexa') && isSocketConnected);
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
