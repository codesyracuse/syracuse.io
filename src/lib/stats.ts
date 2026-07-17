import { getAllEvents } from "./meetup";

// Updated by hand occasionally; a build-time fetch may replace it if the
// Slack API becomes available.
export const SLACK_MEMBER_COUNT = 712;

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
