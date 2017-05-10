const moment = require("moment");

class Linker {
  static problem(user, pid) {
    return `${user.dynatraceUrl}/#problems;filter=watched/problemdetails;pid=${pid};cacheBust=${moment().valueOf()}`;
  }
}

module.exports = Linker;
