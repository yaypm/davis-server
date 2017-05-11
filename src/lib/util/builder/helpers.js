"use strict";

const ACRONYMS = [
  "CPU",
  "ELB",
  "DB",
  "RDS",
  "PGI",
  "HTTP",
  "JS",
  "GC",
  "RMQ",
  "OSI",
  "EBS",
  "VM",
  "ESXI",
];

const SMALLWORDS = [
  "of",
  "and",
  "on",
];

/**
 * Generate audible version of an array of promises
 *
 * @param {Array<Promise<IBuildable>>} args
 * @param {boolean} [compact=false]
 * @returns {Promise<string>}
 */
async function audible(args, compact = false) {
  const strings = await Promise.all(args.map(async arg =>
    Promise.resolve(((await arg).audible) ?
      (await arg).audible(compact) :
      (await arg).toString())));
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
  const slacks = await Promise.all(args.map(async arg =>
    Promise.resolve(((await arg).slack) ?
      (await arg).slack(compact) :
      (await arg).toString())));
  return joinSentence(slacks);
}

/**
 * Generate string version of an array of promises
 *
 * @param {*} args
 * @returns {Promise<string>}
 */
async function stringify(args) {
  const strings = await Promise.all(args.map(async arg => Promise.resolve((await arg).toString())));
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
  "!",
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

function fixCaps(str) {
  return lowerSmallWords(capitalizeAcronyms(str));
}

function lowerSmallWords(str) {
  let out = str;
  SMALLWORDS.forEach((acronym) => {
    out = out.replace(new RegExp(`\\b${acronym}\\b`, "i"), acronym.toLowerCase());
  });
  return out;
}

function capitalizeAcronyms(str) {
  let out = str;
  ACRONYMS.forEach((acronym) => {
    out = out.replace(new RegExp(`\\b${acronym}\\b`, "i"), acronym.toUpperCase());
  });
  return out;
}

module.exports = {
  audible,
  fixCaps,
  slackify,
  stringify,
};
