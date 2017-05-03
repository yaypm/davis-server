"use strict";

const Dynatrace = require("../../core/dynatrace");
const Plugin = require("../../core/plugin");
const sb = require("../../util/builder").sb;

/**
 * Plugin for asking about a recent range
 *
 * "What happened in the last {range}"
 *
 * @class RangeProblem
 * @extends {Plugin}
 */
class RangeProblem extends Plugin {
  constructor() {
    super(...arguments);
    this.name = "rangeProblem";
  }

  /**
   * Main plugin method
   *
   * @param {IDavisRequest} req
   * @returns
   *
   * @memberOf RangeProblem
   */
  async ask(req) {
    const range = req.slots.range;
    const problems = await Dynatrace.problemFeed(req.user, { relativeTime: range });

    return (problems.length === 0) ? noProblems(req.user, range) :
      (problems.length === 1) ? oneProblem(req.user, range, problems[0]) :
        manyProblems(req.user, range, problems);
  }
}

/**
 * No problems in the range
 *
 * @param {IUserModel} user
 * @param {string} range
 * @returns
 */
function noProblems(user, range) {
  return { text: sb(user).s("Nice! There were no problems in the last").d(range).p };
}

/**
 * One problem in the range
 *
 * @param {IUserModel} user
 * @param {string} range
 * @param {IProblem} problem
 * @returns
 */
function oneProblem(user, range, problem) {
  if (problem.status === "OPEN") {
    return openProblem(user, range, problem);
  }
  return closedProblem(user, range, problem);
}

/**
 * One open problem in the range
 *
 * @param {IUserModel} user
 * @param {string} range
 * @param {IProblem} problem
 * @returns
 */
function openProblem(user, range, problem) {
  const stats = Dynatrace.problemStats([problem]);
  const out = sb(user)
    .s("In the last").d(range).c.s("the only problem was a").h(problem.rankedImpacts[0].eventType)
    .s("that started at").ts(problem.startTime).c.s("and is still ongoing.");

  const apps = stats.affectedApps;
  const appIds = Object.keys(apps);

  return {
    text: (appIds.length === 0) ? out.s("No applications are being affected.") :
      (appIds.length === 1) ? out.s("The only affected application is").e(appIds[0], apps[appIds[0]]) :
        out.e(appIds[0], apps[appIds[0]]).s("and").s(appIds.length - 1).s("other applications are being affected."),
  };
}

/**
 * One closed problem in the range
 *
 * @param {IUserModel} user
 * @param {string} range
 * @param {IProblem} problem
 * @returns
 */
function closedProblem(user, range, problem) {
  const stats = Dynatrace.problemStats([problem]);
  const out = sb(user)
    .s("In the last").d(range).c.s("the only problem was a").h(problem.rankedImpacts[0].eventType)
    .s("that started").ts(problem.startTime).c.s("and ended").ts(problem.endTime).p;

  const apps = stats.affectedApps;
  const appIds = Object.keys(apps);

  return {
    text: (appIds.length === 0) ? out.s("No applications were affected.") :
      (appIds.length === 1) ? out.s("The only affected application was").e(appIds[0], apps[appIds[0]]).p :
        out.e(appIds[0], apps[appIds[0]]).s("and").s(appIds.length - 1).s("other applications were affected."),
  };
}

/**
 * More than one problem in the range
 *
 * @param {IUserModel} user
 * @param {string} range
 * @param {IProblem[]} problems
 * @returns
 */
function manyProblems(user, range, problems) {
  return {
    text: sb(user)
      .s("In the last").d(range).c.s(problems.length).s("problems occurred."),
  };
}

module.exports = RangeProblem;
