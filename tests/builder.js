const expect = require("chai").expect;
const Aliases = require("../src/lib/controllers/aliases");
const { sb, TimeRange, TimeStamp } = require("../src/lib/util/builder");
const nock = require("nock");
const { applications } = require("./data/applications");
const { services } = require("./data/services");
const mongoose = require("mongoose");
const { createUserWithTenant } = require("./bootstrap");

describe("util/builder", () => {
  let user;
  let tenant;
  beforeEach(async () => {
    const [testUser, testTenant] = await createUserWithTenant();
    user = testUser;
    tenant = testTenant;
  });
  

  const appnock = nock(/dynatrace/i)
    .get("/api/v1/entity/applications")
    .times(2)
    .reply(200, applications);

  const srvnock = nock(/dynatrace/i)
    .get("/api/v1/entity/services")
    .times(2)
    .reply(200, services);

  const hostnock = nock(/dynatrace/i)
    .get("/api/v1/entity/infrastructure/hosts")
    .times(2)
    .reply(200, []);

  const pginock = nock(/dynatrace/i)
    .get("/api/v1/entity/infrastructure/process-groups")
    .times(2)
    .reply(200, []);

  it("should build slack style timestamps", () => {
    const ms = 1492677420000;
    const ts = new TimeStamp(ms, "Etc/UTC");
    expect(ts.slack())
      .to.equal("<!date^1492677420^{date_long_pretty} at {time}|04/20/2017 at 8:37 AM>");
  });

  it("should build compact slack style timestamps", () => {
    const ms = 1492677420000;
    const ts = new TimeStamp(ms, "Etc/UTC", true);
    expect(ts.slack())
      .to.equal("<!date^1492677420^{date_short_pretty} {time}|04/20/2017 at 8:37 AM>");
  });

  it("should build string style timestamps", () => {
    const ms = 1492677420000;
    const ts = new TimeStamp(ms, "Etc/UTC");
    expect(ts.toString())
      .to.equal("04/20/2017 at 8:37 AM");
  });

  it("should build empty timestamps", () => {
    const ts = new TimeStamp(-1, "Etc/UTC");
    const ts2 = new TimeStamp(-1, "Etc/UTC", true);

    expect(ts.toString()).to.equal("now");
    expect(ts.slack()).to.equal("now");
    expect(ts2.toString()).to.equal("now");
    expect(ts2.slack()).to.equal("now");
  });

  it("should build slack style time ranges", () => {
    const ts = new TimeRange(1492677420000, 1492698780000, "Etc/UTC");
    expect(ts.slack())
      .to.equal("between <!date^1492677420^{date_long_pretty} at {time}|04/20/2017 at 8:37 AM> and " +
        "<!date^1492698780^{date_long_pretty} at {time}|04/20/2017 at 2:33 PM>");
  });

  it("should build string style time ranges", () => {
    const ts = new TimeRange(1492677420000, 1492698780000, "Etc/UTC");
    expect(ts.toString())
      .to.equal("between 04/20/2017 at 8:37 AM and 04/20/2017 at 2:33 PM");
  });

  it("should build compact slack style time ranges", () => {
    const ts = new TimeRange(1492677420000, 1492698780000, "Etc/UTC", true);
    expect(ts.slack())
      .to.equal("<!date^1492677420^{date_short_pretty} {time}|04/20/2017 at 8:37 AM>" +
        " - <!date^1492698780^{date_short_pretty} {time}|04/20/2017 at 2:33 PM>");
  });

  it("should build compact string style time ranges", () => {
    const ts = new TimeRange(1492677420000, 1492698780000, "Etc/UTC", true);
    expect(ts.toString())
      .to.equal("04/20/2017 at 8:37 AM - 04/20/2017 at 2:33 PM");
  });

  it("should build empty time ranges", () => {
    const ts = new TimeRange(null, null, "Etc/UTC, true");
    expect(ts.toString())
      .to.equal("in the last few minutes");
    expect(ts.slack())
      .to.equal("in the last few minutes");
  });

  it("should build a string with a timestamp", async () => {
    const s = await sb(user).s("timestamp is").ts(1492677420000).p.toString();
    expect(s).to.equal("timestamp is 04/20/2017 at 8:37 AM.");
  });

  it("should build a string with a carriage return", async () => {
    const s = await sb(user).s("hey hows it going").n.s("on the second line?").toString();
    expect(s).to.equal("hey hows it going\non the second line?");
  });

  it("should build time ranges", async () => {
    const str = await sb(user).d("P2W4DT9H23M").toString();
    expect(str).to.equal("18 days 9 hours 23 minutes");
  });

  it("should build pluralized strings", async () => {
    const zero = await sb(user).s("one", "two", 0).toString();
    const single = await sb(user).s("one", "two", 1).toString();
    const plural = await sb(user).s("one", "two", 2).toString();
    const arr = await sb(user).s("one", "two", [0, 1]).toString();

    expect(zero).to.equal("two");
    expect(single).to.equal("one");
    expect(plural).to.equal("two");
    expect(arr).to.equal("two");
  })

  it("should return the same values for short and long method versions", async () => {
    const short = sb(user)
      .s("start")
      .d("P2W4DT9H23M")
      .c
      .n
      .p
      .q
      .ts(1492677420000)
      .tr(1492677420000, 1492698780000);

    const long = sb(user)
      .stringable("start")
      .duration("P2W4DT9H23M")
      .comma
      .newline
      .period
      .question
      .tstamp(1492677420000)
      .trange(1492677420000, 1492698780000);

    expect(await short.toString()).to.equal(await long.toString());
    expect(await short.slack()).to.equal(await long.slack());
  });

  it("should build entities", async () => {
    const alias = await Aliases.create(user, {
      aliases: [],
      display: {
        audible: "audible blah",
        visual: "visual blah",
      },
      entityId: "APPLICATION-59CA712F666CD24D",
    });

    const str = await sb(user).e("APPLICATION-59CA712F666CD24D", "fallback").toString();
    expect(str).to.equal("visual blah");
  });

  it("should fallback for entities not in the list", async () => {
    const str = await sb(user).e("this id doesn't exist", "fallback").toString();
    expect(str).to.equal("fallback");
  });
});
