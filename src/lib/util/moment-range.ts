import * as moment from "moment";
require('moment-precise-range-plugin'); // tslint:disable-line

export = moment;

declare module "moment" {
  const preciseDiff: (start: moment.Moment, end: moment.Moment) => string;
}
