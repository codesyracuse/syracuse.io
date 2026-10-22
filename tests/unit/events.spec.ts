import { readFileSync } from "node:fs";
import { test, expect } from "@playwright/test";
import { dedupeEvents } from "../../src/lib/events/dedupe";
import { parseIcal } from "../../src/lib/events/parse";
import { matchSeries } from "../../src/lib/events/series-match";
import {
  dateParts,
  localDateKey,
  monthDay,
  monthsSinceLabel,
  rowDate,
  sinceLabel,
  timeFull,
  timeShort,
} from "../../src/lib/events/format";
import type { FeedEvent } from "../../src/lib/events/types";

const BASE =
  "https://www.meetup.com/syracuse-software-development-meetup/events";

// 6pm Eastern on Tue Oct 13 2026 (EDT, UTC-4).
const OCT_13_6PM = new Date("2026-10-13T22:00:00Z");

function ev(over: Partial<FeedEvent>): FeedEvent {
  return {
    id: "x",
    title: "OpenHack: Code together, on anything",
    start: OCT_13_6PM,
    provider: "meetup",
    ...over,
  };
}

// The relaunch preview showed Oct 13 Open Hack twice: a series-template URL
// and the concrete event URL.
const template = ev({
  id: "vtpvwtyjcnbrb",
  url: `${BASE}/vtpvwtyjcnbrb/?eventOrigin=group_events_list`,
});
const concrete = ev({
  id: "315977415",
  url: `${BASE}/315977415/?eventOrigin=group_events_list`,
});

test.describe("dedupeEvents", () => {
  test("keeps the concrete event whichever order they arrive in", () => {
    expect(dedupeEvents([template, concrete])).toEqual([concrete]);
    expect(dedupeEvents([concrete, template])).toEqual([concrete]);
  });

  test("recognises a concrete event by its URL when the id is opaque", () => {
    const a = ev({ id: "opaque-1", url: `${BASE}/vtpvwtyjcnbrb/` });
    const b = ev({ id: "opaque-2", url: `${BASE}/315977415/` });
    expect(dedupeEvents([a, b]).map((e) => e.id)).toEqual(["opaque-2"]);
  });

  test("ignores case and punctuation in titles", () => {
    const a = ev({ id: "1", title: "Open Hack!" });
    const b = ev({ id: "2", title: "open hack" });
    expect(dedupeEvents([a, b])).toHaveLength(1);
  });

  test("keeps same-title events on different days", () => {
    const nov = ev({
      id: "316355381",
      start: new Date("2026-11-10T23:00:00Z"),
    });
    expect(dedupeEvents([concrete, nov])).toHaveLength(2);
  });

  test("keeps different events on the same day", () => {
    const other = ev({ id: "999", title: "Build with AI" });
    expect(dedupeEvents([concrete, other])).toHaveLength(2);
  });

  test("dedupes by Syracuse calendar day, not UTC day", () => {
    // 9pm and 11pm Eastern on Oct 13 are Oct 14 in UTC for the second one.
    const early = ev({ id: "1", start: new Date("2026-10-14T01:00:00Z") });
    const late = ev({ id: "2", start: new Date("2026-10-14T03:30:00Z") });
    expect(localDateKey(early.start)).toBe("2026-10-13");
    expect(localDateKey(late.start)).toBe("2026-10-13");
    expect(dedupeEvents([early, late])).toHaveLength(1);
  });

  test("a manual entry overrides the feed", () => {
    const manual = ev({
      id: "manual-oct",
      provider: "manual",
      location: "Room 4",
    });
    const [kept] = dedupeEvents([concrete, manual]);
    expect(kept.provider).toBe("manual");
    // ...but still inherits the feed's RSVP link.
    expect(kept.url).toBe(concrete.url);
  });

  test("fills missing fields from the discarded duplicate", () => {
    const withLocation = ev({ id: "315977415", url: `${BASE}/315977415/` });
    const noLocation = ev({ id: "vtpvwtyjcnbrb", location: "Commonspace" });
    expect(dedupeEvents([withLocation, noLocation])[0].location).toBe(
      "Commonspace"
    );
  });
});

test.describe("parseIcal", () => {
  const events = parseIcal(
    readFileSync("tests/fixtures/meetup.ics", "utf8"),
    "meetup"
  );

  test("reads every event in the Meetup feed", () => {
    expect(events).toHaveLength(3);
  });

  test("uses the numeric event id and tags the provider", () => {
    expect(events[0].id).toBe("315977415");
    expect(events.every((e) => e.provider === "meetup")).toBe(true);
  });

  test("reads times in America/New_York", () => {
    // DTSTART;TZID=America/New_York:20261020T180000
    expect(events[0].start.toISOString()).toBe("2026-10-20T22:00:00.000Z");
    expect(events[0].end?.toISOString()).toBe("2026-10-21T00:00:00.000Z");
  });

  test("unescapes the title and keeps the RSVP URL", () => {
    expect(events[0].title).toBe("OpenHack: Code together, on anything");
    expect(events[0].url).toBe(`${BASE}/315977415/`);
  });
});

test.describe("matchSeries", () => {
  const series = [
    { slug: "open-hack", match: "OpenHack" },
    { slug: "build-with-ai", match: "/build with ai/i" },
  ];

  test("matches by substring ignoring case, spacing and punctuation", () => {
    expect(matchSeries("OpenHack: Code together, on anything", series)).toBe(
      "open-hack"
    );
    expect(matchSeries("Open Hack", series)).toBe("open-hack");
  });

  test("supports /regex/ patterns", () => {
    expect(matchSeries("Build With AI night", series)).toBe("build-with-ai");
  });

  test("returns undefined for a community event", () => {
    expect(matchSeries("Dev Drinks", series)).toBeUndefined();
  });
});

test.describe("format", () => {
  test("formats in Syracuse time, not server time", () => {
    expect(dateParts(OCT_13_6PM)).toEqual({
      weekday: "Tue",
      month: "Oct",
      day: "13",
    });
    expect(rowDate(OCT_13_6PM)).toBe("TUE 10·13");
    expect(monthDay(OCT_13_6PM)).toBe("Oct 13");
    expect(timeShort(OCT_13_6PM)).toBe("6pm");
    expect(timeFull(OCT_13_6PM)).toBe("6:00pm");
  });

  test("keeps minutes in the short time when they matter", () => {
    expect(timeShort(new Date("2026-10-13T22:30:00Z"))).toBe("6:30pm");
  });

  test("handles standard time after the November change", () => {
    // 6pm EST is 23:00Z.
    expect(timeShort(new Date("2026-11-10T23:00:00Z"))).toBe("6pm");
  });

  test("sinceLabel", () => {
    expect(sinceLabel("2014-04")).toBe("April 2014");
  });

  test("monthsSinceLabel counts both ends and rounds down to tens", () => {
    // April 2014 through October 2026 is 151 months.
    const oct = new Date("2026-10-21T16:00:00Z");
    expect(monthsSinceLabel("2014-04", oct)).toBe("150+");
    const jan = new Date("2026-01-15T16:00:00Z");
    expect(monthsSinceLabel("2014-04", jan)).toBe("140+");
  });
});
