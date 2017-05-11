"use strict";

const Plugin = require("../../../core/plugin");
const Dynatrace = require("../../../core/dynatrace");
const sb = require("../../../util/builder").sb;
const Util = require("../../../util");
const moment = require("moment-timezone");

class DateProblem extends Plugin {
  constructor() {
    super(...arguments);
    this.name = "dateProblem";
  }

  parseSlots(user, slots) {
    if (slots.dow) {
      const date = moment().day(slots.dow);
      if (date.isAfter(moment())) {
        slots.date = date.subtract(1, "week").format("YYYY-MM-DD");
      } else {
        slots.date = date.format("YYYY-MM-DD");
      }
    } else if (!slots.date && slots.app) {
      if (/yesterday$/i.test(slots.app)) {
        slots.date = moment.tz(user.timezone).subtract(1, "day").format("YYYY-MM-DD");
        slots.app = slots.app.replace(/yesterday$/i, "");
      }
      if (/today$/i.test(slots.app)) {
        slots.date = moment.tz(user.timezone).format("YYYY-MM-DD");
        slots.app = slots.app.replace(/today$/i, "");
      }
      if (/tomorrow$/i.test(slots.app)) {
        slots.date = moment.tz(user.timezone).add(1, "day").format("YYYY-MM-DD");
        slots.app = slots.app.replace(/tomorrow$/i, "");
      }
    }
    return slots;
  }

  // TODO workaround for yesterday/today/tomorrow
  async ask(req) {
    if (req.slots.app) {
      const entity = await Dynatrace.findApplicationBySoundalike(req.user, req.slots.app);
      if (!entity) {
        return { text: `I'm sorry, I couldn't find the application ${req.slots.app}` };
      }
      return appResponse(req, entity);
    }

    return response(req);
  }
}

async function response(req) {
  const timeRange = Util.Date.dateParser(req.slots.date, req.user);
  const problems = await Dynatrace.problemFeed(req.user, { timeRange });
  return (problems.length === 0) ? noProblem(req) :
    (problems.length === 1) ? oneProblem(req, problems[0]) :
      manyProblems(req, problems);
}

async function appResponse(req, entity) {
  const timeRange = Util.Date.dateParser(req.slots.date, req.user);
  const unfiltered = await Dynatrace.problemFeed(req.user, { timeRange });
  const problems = Dynatrace.filterProblemFeed(unfiltered, { entityId: entity.entityId });
  return (problems.length === 0) ? appNoProblem(req, entity) :
    (problems.length === 1) ? appOneProblem(req, problems[0], entity) :
      appManyProblems(req, problems, entity);
}

async function noProblem(req) {
  return { text: sb(req.user).s("Great! No problems affected").date(req.slots.date).s("!") };
}

async function appNoProblem(req, entity) {
  return {
    text: sb(req.user).s("Great! No problems affected").e(entity.entityId, entity.name)
      .date(req.slots.date).s("!"),
  };
}

async function oneProblem(req, problem) {
  const detail = await req.davis.plugins.detailProblem._yes(req, problem.id);
  return {
    text: sb(req.user).s("Only one problem occurred").date(req.slots.date).p.s(detail.text),
    show: {
      text: sb(req.user).s("Only one problem occurred").date(req.slots.date).p,
      attachments: detail.show.attachments,
    },
  };
}

async function appOneProblem(req, problem, entity) {
  const detail = await req.davis.plugins.detailProblem._yes(req, problem.id);
  return {
    text: sb(req.user).s("Only one problem occurred").date(req.slots.date).s("that affected")
      .e(entity.entityId, entity.name).p.s(detail.text),
    show: {
      text: sb(req.user).s("Only one problem occurred").date(req.slots.date).s("that affected")
        .e(entity.entityId, entity.name).p,
      attachments: detail.show.attachments,
    },
  };
}

async function manyProblems(req, problems) {
  return {
    text: sb(req.user)
      .date(req.slots.date).s(problems.length)
      .s("problems occurred. Would you like to see a listing of these issues?"),
    targets: {
      yes: {
        intent: "showPage",
      },
    },
    paging: {
      items: problems.map(p => ({ id: p.id, source: "detailProblem", target: "detailProblem" })),
    },
  };
}

async function appManyProblems(req, problems, entity) {
  return {
    text: sb(req.user)
      .date(req.slots.date).s(problems.length)
      .s("problems affected").e(entity.entityId, entity.name).p.s("Would you like to see a listing of these issues?"),
    targets: {
      yes: {
        intent: "showPage",
      },
    },
    paging: {
      items: problems.map(p => ({ id: p.id, source: "detailProblem", target: "detailProblem" })),
    },
  };
}

module.exports = DateProblem;
