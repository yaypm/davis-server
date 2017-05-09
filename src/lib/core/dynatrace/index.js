const moment = require("moment");
const rp = require("request-promise");
const _ = require("lodash");

const Aliases = require("../../controllers/aliases");
const logger = require("../logger");
const DError = require("../../core/error");

/**
 * Static class for interacting with Dynatrace
 *
 * @class Dynatrace
 */
class Dynatrace {
  /**
   * Make GET requests against a user's Dynatrace API
   *
   * @static
   * @param {IUserModel} user
   * @param {string} endpoint
   * @param {*} [options]
   * @returns {Promise<any>}
   *
   * @memberOf Dynatrace
   */
  static async get(user, endpoint, options, tokens) {
    const baseUrl = user.dynatraceApiUrl;
    const apiTokens = tokens || user.dynatraceApiTokens();
    const apiToken = apiTokens.shift();

    const uri = `${baseUrl}/api/v1/${endpoint}`;

    try {
      const response = await rp.get(uri, {
        headers: {
          Authorization: `Api-Token ${apiToken}`,
        },
        json: true,
        qs: options,
        timeout: 20000,
        time: true,
        transform: logDynatraceTimes,
      });

      const tenant = user.tenant;
      await tenant.setActiveToken(apiToken);
      return response;
    } catch (err) {
      if (err.statusCode === 400) {
        if (_.has(err, "response.error.message")) {
          throw new DError(`Unable to contact Dynatrace!  ${err.response.error.message}`);
        }
        throw new DError("Unable to contact Dynatrace!  Are you sure you set the correct URL?");
      } else if (err.statusCode === 401) {
        if (apiTokens.length > 0) {
          return Dynatrace.get(user, endpoint, options, apiTokens);
        }
        throw new DError("The configured Dynatrace API token is invalid!");
      } else if (err.error && err.error.code === "ENOENT") {
        throw new DError("Unable to contact Dynatrace!  Are you sure you have an active network connection?");
      } else {
        logger.error(`Dynatrace responded with an unhandled status code of ${err.statusCode}.`);
        throw new DError("Unfortunately, there was an issue communicating with Dynatrace.");
      }
    }
  }

  /**
   * Get all entities from
   *
   * @static
   * @param {IUserModel} user
   * @returns { applications[], services: IService[], hosts: IHost[], processGroups: IProcessGroup[] }
   *
   * @memberOf Dynatrace
   */
  static async getAllEntities(user) {
    const [applications, services, hosts, processGroups] = await Promise.all([
      Dynatrace.getApplications(user),
      Dynatrace.getServices(user),
      Dynatrace.getHosts(user),
      Dynatrace.getProcessGroups(user),
    ]);

    return { applications, services, hosts, processGroups };
  }

  /**
   * Get applications
   *
   * @static
   * @param {IUserModel} user
   * @returns {Promise<IApplication[]>}
   *
   * @memberOf Dynatrace
   */
  static async getApplications(user) {
    const [apps, aliases] = await Promise.all([
      Dynatrace.get(user, "entity/applications")
        .then(res => res.filter(app => app.applicationType !== "SYNTHETIC")),
      Aliases.getByTenant(user.tenant, "APPLICATION"),
    ]);
    return Dynatrace.mergeAliases(apps, aliases);
  }

  /**
   * Get services
   *
   * @static
   * @param {IUserModel} user
   * @returns {Promise<IService[]>}
   *
   * @memberOf Dynatrace
   */
  static async getServices(user) {
    const [services, aliases] = await Promise.all([
      Dynatrace.get(user, "entity/services"),
      Aliases.getByTenant(user.tenant, "SERVICE"),
    ]);
    return Dynatrace.mergeAliases(services, aliases);
  }

  /**
   * Get hosts
   *
   * @static
   * @param {IUserModel} user
   * @returns {Promise<IHost[]>}
   *
   * @memberOf Dynatrace
   */
  static async getHosts(user) {
    const [hosts, aliases] = await Promise.all([
      Dynatrace.get(user, "entity/infrastructure/hosts"),
      Aliases.getByTenant(user.tenant, "HOST"),
    ]);
    return Dynatrace.mergeAliases(hosts, aliases);
  }

  /**
   * Get process groups
   *
   * @static
   * @param {IUserModel} user
   * @returns {Promise<IProcessGroup[]>}
   *
   * @memberOf Dynatrace
   */
  static async getProcessGroups(user) {
    const [processGroups, aliases] = await Promise.all([
      Dynatrace.get(user, "entity/infrastructure/process-groups"),
      Aliases.getByTenant(user.tenant, "PROCESS_GROUP"),
    ]);
    return Dynatrace.mergeAliases(processGroups, aliases);
  }

  /**
   * Get a list of problems
   *
   * @static
   * @param {IUserModel} user
   * @param {IProblemFeedOptions} options
   * @returns {Promise<IProblem[]>}
   *
   * @memberOf Dynatrace
   */
  static async problemFeed(user, options) {
    if (options.relativeTime &&
      !(/^hour$|^2hours$|^6hours$|^day$|^week$|^month$/.test(options.relativeTime))) {
      const range = options.relativeTime;
      const duration = moment.duration(range);
      options.relativeTime = Dynatrace.rangeToRelativeTime(range);
      const res = await Dynatrace.get(user, "problem/feed", options);
      return res
        .result
        .problems
        .filter(p => moment(p.startTime).isAfter(moment().subtract(duration)));
    }

    const res = await Dynatrace.get(user, "problem/feed", options);
    return res.result.problems;
  }

  /**
   * Get details about a problem
   *
   * @static
   * @param {IUserModel} user
   * @param {string} pid
   * @returns {Promise<IProblem>}
   *
   * @memberOf Dynatrace
   */
  static async problemDetails(user, pid) {
    const res = await Dynatrace.get(user, `problem/details/${pid}`);
    return res.result;
  }

  /**
   * Convert an ISO 8601 date range into a Dynatrace relativeTime
   *
   * @static
   * @param {string} range
   * @returns {string}
   *
   * @memberOf Dynatrace
   */
  static rangeToRelativeTime(range) {
    const duration = moment.duration(range).asSeconds();
    return (duration <= 60 * 60) ? "hour" :
           (duration <= 2 * 60 * 60) ? "2hours" :
           (duration <= 6 * 60 * 60) ? "6hours" :
           (duration <= 24 * 60 * 60) ? "day" :
           (duration <= 7 * 24 * 60 * 60) ? "week" :
           "month";
  }

  /**
   * Compute stats about a list of problems
   *
   * @static
   * @param {IProblem[]} problems
   * @returns
   *
   * @memberOf Dynatrace
   */
  static problemStats(problems) {
    return {
      affectedApps: Dynatrace.affectedEntityByType(problems, "APPLICATION"),
      counts: {
        hourly: Dynatrace.countByHour(problems),
      },
      firstProblem: _.minBy(problems, "startTime"),
      lastProblem: _.maxBy(problems, "startTime"),
      openProblems: _.filter(problems, { status: "OPEN" }),
    };
  }

  /**
   * Count the number of problems in each hour
   *
   * @static
   * @param {IProblem[]} problems
   * @returns
   *
   * @memberOf Dynatrace
   */
  static countByHour(problems) {
    return _.countBy(problems, problem => (Math.floor(problem.startTime / 3600000) * 3600000));
  }

  /**
   * Get a stringmap of entity ids to entity names affected
   *
   * @static
   * @param {IProblem[]} problems
   * @param {string} type
   * @returns
   *
   * @memberOf Dynatrace
   */
  static affectedEntityByType(problems, type) {
    const apps = {};
    problems.forEach((problem) => {
      problem.rankedImpacts.forEach((impact) => {
        if (impact.impactLevel === type) {
          apps[impact.entityId] = impact.entityName;
        }
      });
    });
    return apps;
  }

  /**
   * Merge aliases from the database with a list of entities
   *
   * @private
   * @static
   * @template T
   * @param {T[]} apps
   * @param {IAliasModel[]} aliases
   * @returns {T[]}
   *
   * @memberOf Dynatrace
   */
  static mergeAliases(apps, aliases) {
    return apps.map((app) => {
      const alias = _.find(aliases, a => app.entityId === a.entityId);
      app.name = app.customizedName || app.displayName || "";
      app.category = app.entityId.split("-")[0];
      // The name property makes these values unnecessary
      delete app.customizedName;
      delete app.displayName;
      // Found a match in the DB
      if (alias) {
        app.id = alias._id;
        app.aliases = alias.aliases;
        app.display = {
          audible: alias.display.audible || app.name,
          visual: alias.display.visual || app.name,
        };
      } else {
        app.id = null;
        app.aliases = [];
        app.display = { visual: app.name, audible: app.name };
      }
      return app;
    });
  }
}

function logDynatraceTimes(body, response) {
  const path = response.req.path.split("?")[0];
  const metadata = {
    type: "Dynatrace",
    path,
    code: response.statusCode,
    time: response.elapsedTime,
  };

  logger.info(metadata, `DYNATRACE API: ${path} ${response.statusCode} - ${response.elapsedTime} ms`);
  return body;
}

module.exports = Dynatrace;
