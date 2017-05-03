"use strict";

/**
 * Generate audible version of an array of promises
 *
 * @param {Array<Promise<IBuildable>>} args
 * @param {boolean} [compact=false]
 * @returns {Promise<string>}
 */
async function audible(args, compact = false) {
  const sync = await Promise.all(args);
  const strings = sync.map(arg => (arg.audible) ? arg.audible(compact) : arg.toString());
  return joinSentence(strings);
}

/**
 * Generate slack version of an array of promises
 *
 * @param {IBuildable[]} args
 * @param {boolean} [compact=false]
 * @returns {Promise<string>}
 */
async function slackify(args, compact = false) {
  const sync = await Promise.all(args);
  const slacks = sync.map(arg => (arg.slack) ? arg.slack(compact) : arg.toString());
  return joinSentence(slacks);
}

/**
 * Generate string version of an array of promises
 *
 * @param {*} args
 * @returns {Promise<string>}
 */
async function stringify(args) {
  const sync = await Promise.all(args);
  const strings = sync.map(arg => arg.toString());
  return joinSentence(strings);
}

/**
 * Join a list of words together into a sentence
 *
 * @param {string[]} tokens
 * @returns
 */
function joinSentence(tokens) {
  let out = "";
  tokens.forEach((word) => {
    out = joinWord(out, word);
  });
  return out;
}

const punctuation = [
  ".",
  ",",
  "?",
  "\n",
];

/**
 * Determine if a token is a punctuation mark
 *
 * @param {string} word
 * @returns
 */
function isPunctuation(word) {
  return (punctuation.indexOf(word) !== -1);
}

/**
 * Join a token onto the end of a sentence string
 *
 * @param {string} sentence
 * @param {string} word
 * @returns
 */
function joinWord(sentence, word) {
  return (sentence === "") ? word :
         (isPunctuation(word)) ? sentence + word :
         (sentence[sentence.length - 1] === "\n") ? sentence + word :
           `${sentence} ${word}`;
}

module.exports = {
  audible,
  slackify,
  stringify,
};
