import { localDateKey } from "./format";
import type { FeedEvent } from "./types";

export function normalizeTitle(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

/**
 * Meetup lists a recurring event twice: once under a series-template URL
 * (/events/vtpvwtyjcnbrb/) and once under the concrete event (/events/315977415/).
 * Prefer the one whose ID or URL ends in a number.
 */
export function hasConcreteId(event: FeedEvent): boolean {
  if (/^\d+$/.test(event.id)) return true;
  return /\/\d+\/?(\?|$)/.test(event.url?.split("#")[0] ?? "");
}

// Manual entries are deliberate overrides, so they beat anything from a feed.
function priority(event: FeedEvent): number {
  return (event.provider === "manual" ? 2 : 0) + (hasConcreteId(event) ? 1 : 0);
}

/**
 * Collapse events that share a local calendar day and normalized title,
 * keeping the highest-priority entry (first seen wins ties). Fields the
 * winner lacks are filled from the entries it replaced.
 */
export function dedupeEvents(events: FeedEvent[]): FeedEvent[] {
  const best = new Map<string, FeedEvent>();
  for (const event of events) {
    const key = `${localDateKey(event.start)}|${normalizeTitle(event.title)}`;
    const current = best.get(key);
    if (!current) {
      best.set(key, event);
      continue;
    }
    const [winner, loser] =
      priority(event) > priority(current) ? [event, current] : [current, event];
    best.set(key, {
      ...winner,
      end: winner.end ?? loser.end,
      location: winner.location ?? loser.location,
      url: winner.url ?? loser.url,
      series: winner.series ?? loser.series,
    });
  }
  return [...best.values()];
}
