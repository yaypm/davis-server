"use strict";

const Plugin = require("../../../core/plugin");
const { cb, sb } = require("../../../util/builder");
const Dynatrace = require("../../../core/dynatrace");
const Linker = require("../../../util/linker");

class DetailProblem extends Plugin {
  constructor() {
    super(...arguments);
    this.name = "detailProblem";
  }

  /**
   * Choice handler
   *
   * @param {IDavisRequest} req
   * @param {Number} choice
   * @returns {IDavisResponse}
   *
   * @memberOf DetailProblem
   */
  async yes(req, pid) {
    const detail = await Dynatrace.problemDetails(req.user, pid);
    const stats = Dynatrace.detailStats(detail);

    const summary = getSummary(req, detail);
    const cards = stats.eventTypes.map(etype => eventHandler(req, etype, stats));

    const text = (stats.open) ? openProblem(req, detail, stats) : closedProblem(req, detail, stats);

    cards.unshift(summary);

    return {
      text,
      show: {
        text: "Below are the problem details you requested",
        attachments: await Promise.all(cards.map(c => c.slack())),
      },
    };
  }

  async listItem(req, id) {
    const details = await Dynatrace.problemDetails(req.user, id);
    return {
      text: problemTitle(req.user, details),
      value: details,
    };
  }


}

function getSummary(req, detail) {
  return cb(req.user)
    .color(detail.status)
    .title(problemTitle(req.user, detail))
    .url(Linker.problem(req.user, detail.id))
    .field("Time Frame", sb(req.user).tr(detail.startTime, detail.endTime, true));
}

function eventHandler(req, eType, stats) {
  const estats = stats.eventStats[eType];
  const card = cb(req.user)
    .title(sb(req.user).hc(eType))
    .color((estats.open.length) ? "OPEN" : "CLOSED")
    .field("Open", `${estats.openCount} of ${estats.count}`);

  if (estats.locations.length > 0) {
    card.field("Locations", estats.locations.join(", "));
  }

  if (estats.affectedApplications.length > 0) {
    const field = sb(req.user);
    estats.affectedApplications.forEach((app) => {
      field.e(app, stats.affectedEntities[app]).s("\n");
    });
    card.field("Affected Applications", field);
  }

  if (estats.root) {
    card.title("[ROOT CAUSE]");
  }
  return card;
}

/**
 * One open problem
 *
 * @param {IDavisRequest} req
 * @param {IProblemDetails} problem
 * @param {IDetailStats} stats
 * @returns
 */
function openProblem(req, problem, stats) {
  return (stats.open) ? openRoot(req, problem, stats) : openNoRoot(req, problem, stats);
}

function openRoot(req, problem, stats) {
  // This problem is a user action duration degradation on www.easytravelb2b.com.
  return "not implemented";
}

function openNoRoot(req, problem, stats) {
  return "not implemented";
}

/**
 * One closed problem
 *
 * @param {IDavisRequest} req
 * @param {IProblemDetails} problem
 * @param {IDetailStats} stats
 * @returns
 */
function closedProblem(req, problem, stats) {
  return (stats.open) ? closedRoot(req, problem, stats) : closedNoRoot(req, problem, stats);
}

function closedRoot(user, problem, stats) {
  return "not implemented";
}

function closedNoRoot(user, problem, stats) {
  return "not implemented";
}

function problemTitle(user, problem) {
  const last = problem.rankedEvents.length - 1;
  return sb(user)
    .hc(problem.rankedEvents[last].eventType)
    .s("on").e(problem.rankedEvents[last].entityId, problem.rankedEvents[last].entityName);
}

module.exports = DetailProblem;
