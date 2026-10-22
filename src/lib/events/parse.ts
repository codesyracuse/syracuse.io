import ical from "node-ical";
import type { FeedEvent } from "./types";

type Text = string | { val?: string } | undefined;

function text(value: Text): string | undefined {
  const s = typeof value === "string" ? value : value?.val;
  return s?.trim() || undefined;
}

/** Normalize an iCal feed into events. Cancelled events are dropped. */
export function parseIcal(source: string, provider: string): FeedEvent[] {
  const events: FeedEvent[] = [];
  for (const item of Object.values(ical.sync.parseICS(source))) {
    if (item.type !== "VEVENT" || !(item.start instanceof Date)) continue;
    if (item.status === "CANCELLED") continue;

    const uid = text(item.uid) ?? "";
    // Meetup UIDs look like "event_315977415@meetup.com".
    const id = uid.match(/^event_(\d+)@/)?.[1] ?? uid;
    events.push({
      id,
      title: text(item.summary as Text) ?? "Untitled event",
      start: item.start,
      end: item.end instanceof Date ? item.end : undefined,
      location: text(item.location as Text),
      url: text(item.url as Text),
      provider,
    });
  }
  return events;
}
