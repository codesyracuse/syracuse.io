import { getAllEvents } from "./meetup";
import { fetchJobs } from "./jobkit";

// Updated by hand occasionally; a build-time fetch may replace it if the
// Slack API becomes available.
export const SLACK_MEMBER_COUNT = 712;

// Season total for SYR; hardcoded until the NWS fetch lands (redesign phase 7).
export const SNOWFALL_INCHES = "127.4";

/** Events whose dateTime falls in the current calendar month (past + upcoming — activity proof, not just what's left). */
export function getEventsThisMonth(): number {
  const now = new Date();
  return getAllEvents().filter((event) => {
    const d = new Date(event.dateTime);
    return (
      d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth()
    );
  }).length;
}

/** Open role count from JobKit, or null when the API is unreachable at build time. */
export async function getOpenJobCount(): Promise<number | null> {
  try {
    const jobs = await fetchJobs();
    return jobs.length;
  } catch {
    return null;
  }
}
