import { test, expect } from "@playwright/test";
import { selectActiveJobs } from "../../src/lib/jobs-select";
import { dateOnlyLabel } from "../../src/lib/events/format";

const NOW = new Date("2026-10-19T15:00:00Z"); // Mon Oct 19, 11am in Syracuse

function job(title: string, posted: string, expires: string, featured = false) {
  return {
    data: {
      title,
      posted: new Date(posted),
      expires: new Date(expires),
      featured,
    },
  };
}

test.describe("selectActiveJobs", () => {
  test("drops jobs whose expiry day has passed", () => {
    const jobs = [
      job("old", "2026-09-01", "2026-10-18"),
      job("ok", "2026-10-01", "2026-10-31"),
    ];
    expect(selectActiveJobs(jobs, NOW).map((j) => j.data.title)).toEqual([
      "ok",
    ]);
  });

  test("keeps a job through the whole of its expiry day", () => {
    const today = job("today", "2026-10-05", "2026-10-19");
    expect(selectActiveJobs([today], NOW)).toHaveLength(1);
    // ...even late that evening in Syracuse (11:30pm EDT = 03:30Z next day).
    expect(
      selectActiveJobs([today], new Date("2026-10-20T03:30:00Z"))
    ).toHaveLength(1);
    // ...and gone the next day.
    expect(
      selectActiveJobs([today], new Date("2026-10-20T12:00:00Z"))
    ).toHaveLength(0);
  });

  test("featured jobs come first, then newest first", () => {
    const jobs = [
      job("plain-old", "2026-10-01", "2026-11-30"),
      job("plain-new", "2026-10-15", "2026-11-30"),
      job("featured-old", "2026-09-20", "2026-11-30", true),
    ];
    expect(selectActiveJobs(jobs, NOW).map((j) => j.data.title)).toEqual([
      "featured-old",
      "plain-new",
      "plain-old",
    ]);
  });

  test("an empty list stays empty", () => {
    expect(selectActiveJobs([], NOW)).toEqual([]);
  });
});

test("date-only labels don't slip a day in Syracuse time", () => {
  // `posted: 2026-10-01` parses as UTC midnight, which is Sep 30 in New York.
  expect(dateOnlyLabel(new Date("2026-10-01"))).toBe("Oct 1");
});
