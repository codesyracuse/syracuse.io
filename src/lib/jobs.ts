import { getCollection, type CollectionEntry } from "astro:content";

export type Job = CollectionEntry<"jobs">;

/** Unexpired jobs at build time, featured first, then newest. */
export async function getActiveJobs(now = new Date()): Promise<Job[]> {
  const all = await getCollection("jobs", ({ data }) => data.expires >= now);
  return all.sort(
    (a, b) =>
      Number(b.data.featured) - Number(a.data.featured) ||
      b.data.posted.getTime() - a.data.posted.getTime()
  );
}
