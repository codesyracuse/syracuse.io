import { getCollection, type CollectionEntry } from "astro:content";

export type Job = CollectionEntry<"jobs">;

const DAY_MS = 86_400_000;

/**
 * Unexpired jobs at build time, featured first, then newest. `expires` is a
 * date-only value (UTC midnight) and a job stays up through that whole day.
 */
export async function getActiveJobs(now = new Date()): Promise<Job[]> {
  const all = await getCollection(
    "jobs",
    ({ data }) => data.expires.getTime() + DAY_MS > now.getTime()
  );
  return all.sort(
    (a, b) =>
      Number(b.data.featured) - Number(a.data.featured) ||
      b.data.posted.getTime() - a.data.posted.getTime()
  );
}
