import { getCollection, type CollectionEntry } from "astro:content";
import { calendarDay, localDateKey } from "./events/format";

export type Sponsor = CollectionEntry<"sponsors">;

/** Sponsors whose start/end window includes now. Expired ones drop out at build. */
export async function getActiveSponsors(now = new Date()): Promise<Sponsor[]> {
  const all = await getCollection("sponsors");
  // start and end are date-only; a sponsor is active through its whole end day.
  const today = localDateKey(now);
  return all.filter(({ data }) => {
    if (data.start && calendarDay(data.start) > today) return false;
    if (data.end && calendarDay(data.end) < today) return false;
    return true;
  });
}

/** Home "Made possible by": all active hosts and annual partners. */
export async function getThanksTo(now = new Date()): Promise<Sponsor[]> {
  return (await getActiveSponsors(now)).filter(
    (s) => s.data.kind === "host" || s.data.kind === "annual"
  );
}

/** Hosts for one series. A host with no `series` list hosts everything. */
export async function getSeriesHosts(
  slug: string,
  now = new Date()
): Promise<Sponsor[]> {
  return (await getActiveSponsors(now)).filter(
    (s) =>
      s.data.kind === "host" && (!s.data.series || s.data.series.includes(slug))
  );
}

/** The sponsor covering food on the night of `eventDay` ("YYYY-MM-DD", Syracuse time). */
export async function getEventSponsor(
  eventDay: string,
  slug?: string,
  now = new Date()
): Promise<Sponsor | undefined> {
  return (await getActiveSponsors(now)).find(
    (s) =>
      s.data.kind === "event" &&
      s.data.event_date &&
      calendarDay(s.data.event_date) === eventDay &&
      (!s.data.series || !slug || s.data.series.includes(slug))
  );
}
