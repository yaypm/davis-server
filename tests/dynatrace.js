const expect = require("chai").expect;
const Dynatrace = require("../src/lib/core/dynatrace");
const { problems, stats } = require("./data/problemFeed");

describe("Dynatrace", () => {
  it("should convert ISO 8601 ranges to appropriate dynatrace relative ranges", () => {
    const hour = Dynatrace.rangeToRelativeTime("PT48M");
    const twohour = Dynatrace.rangeToRelativeTime("PT1H48M");
    const sixhour = Dynatrace.rangeToRelativeTime("PT3H48M");
    const day = Dynatrace.rangeToRelativeTime("PT8H48M");
    const week = Dynatrace.rangeToRelativeTime("P3DT5H48M");
    const month = Dynatrace.rangeToRelativeTime("P12DT48M");

    expect(hour).to.equal("hour");
    expect(twohour).to.equal("2hours");
    expect(sixhour).to.equal("6hours");
    expect(day).to.equal("day");
    expect(week).to.equal("week");
    expect(month).to.equal("month");
  });

  it("should compute stats about problems from the feed", () => {
    const stats = Dynatrace.problemStats(problems);
    expect(stats).to.deep.equal(stats);
  });
});
