import { getAllEvents } from "./meetup";

// Hardcoded so it ages gracefully; a Slack API hookup may replace it later.
export const SLACK_MEMBER_COUNT = "750+";

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
