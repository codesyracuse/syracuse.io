import { getCollection } from "astro:content";
import { EVENT_FEEDS, PROVIDER_LABELS } from "../../config/events";
import { dedupeEvents } from "./dedupe";
import { parseIcal } from "./parse";
import { matchSeries } from "./series-match";
import type { FeedEvent } from "./types";

export type { FeedEvent } from "./types";

/** A feed event plus what pages need to show it. */
export interface SiteEvent extends FeedEvent {
  seriesName?: string;
  venueName?: string;
  neighborhood?: string;
  /** "Meetup", for "via Meetup". Undefined for manual events. */
  providerLabel?: string;
}

// Events without a known end are treated as running this long.
const DEFAULT_DURATION_MS = 3 * 60 * 60 * 1000;

async function fetchFeed(feed: { provider: string; url: string }) {
  const res = await fetch(feed.url, { signal: AbortSignal.timeout(20_000) });
  // Throwing fails the build, so the previous deploy keeps serving rather
  // than an empty calendar going live.
  if (!res.ok) {
    throw new Error(`Event feed ${feed.provider} returned ${res.status}`);
  }
  const body = await res.text();
  // Some platforms answer a bad feed URL with a 200 HTML page.
  if (!body.includes("BEGIN:VCALENDAR")) {
    throw new Error(
      `Event feed ${feed.provider} did not return an iCal calendar`
    );
  }
  return parseIcal(body, feed.provider);
}

async function loadEvents(): Promise<SiteEvent[]> {
  const [feeds, manual, series, venues] = await Promise.all([
    Promise.all(EVENT_FEEDS.map(fetchFeed)),
    getCollection("events"),
    getCollection("series"),
    getCollection("venues"),
  ]);

  const manualEvents: FeedEvent[] = manual.map((e) => ({
    id: `manual-${e.id}`,
    title: e.data.title,
    start: e.data.start,
    end: e.data.end,
    location: e.data.location,
    url: e.data.url,
    provider: "manual",
    series: e.data.series,
  }));

  const matchers = series.map((s) => ({ slug: s.id, match: s.data.match }));
  const merged = dedupeEvents([...manualEvents, ...feeds.flat()]);

  return merged
    .map((event): SiteEvent => {
      const slug = event.series ?? matchSeries(event.title, matchers);
      const s = series.find((x) => x.id === slug);
      const venue = venues.find((v) => v.id === s?.data.venue.id);
      return {
        ...event,
        series: slug,
        seriesName: s?.data.name,
        venueName: venue?.data.name,
        neighborhood: venue?.data.neighborhood,
        providerLabel: PROVIDER_LABELS[event.provider],
        location: event.location ?? venue?.data.name,
      };
    })
    .sort((a, b) => a.start.getTime() - b.start.getTime());
}

let cached: Promise<SiteEvent[]> | undefined;

/** Every event from every feed and manual file, deduped, soonest first. */
export function getEvents(): Promise<SiteEvent[]> {
  return (cached ??= loadEvents());
}

export function isUpcoming(event: FeedEvent, now = new Date()): boolean {
  const end =
    event.end ?? new Date(event.start.getTime() + DEFAULT_DURATION_MS);
  return end >= now;
}

export async function getUpcomingEvents(
  now = new Date()
): Promise<SiteEvent[]> {
  return (await getEvents()).filter((e) => isUpcoming(e, now));
}

export async function getUpcomingForSeries(
  slug: string,
  now = new Date()
): Promise<SiteEvent[]> {
  return (await getUpcomingEvents(now)).filter((e) => e.series === slug);
}

export async function getNextEvent(
  now = new Date()
): Promise<SiteEvent | undefined> {
  return (await getUpcomingEvents(now))[0];
}

/**
 * RSVP link on the event's own platform, tagged for analytics. Falls back to
 * the series page when an event has no platform URL.
 */
export function rsvpUrl(event: SiteEvent): string {
  if (!event.url) return event.series ? `/${event.series}` : "/#email";
  const url = new URL(event.url);
  url.searchParams.set("utm_source", "syracuse.io");
  url.searchParams.set("utm_medium", "site");
  url.searchParams.set("utm_campaign", event.series ?? "community");
  return url.toString();
}
