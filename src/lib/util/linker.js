const moment = require("moment");

class Linker {
  static problem(user, pid) {
    return `${user.activeTenant.url}/#problems;filter=watched/problemdetails;pid=${pid};cacheBust=${moment().valueOf()}`;
  }
}

module.exports = Linker;
