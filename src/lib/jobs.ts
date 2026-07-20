import { getCollection, type CollectionEntry } from "astro:content";

export type Job = CollectionEntry<"jobs">;

/**
 * Live listings: expired jobs drop out automatically — stale jobs are the
 * fastest way to make a site look dead. Featured first, then newest.
 */
export async function getOpenJobs(): Promise<Job[]> {
  const now = new Date();
  const jobs = await getCollection("jobs", ({ data }) => data.expires >= now);
  return jobs.sort(
    (a, b) =>
      Number(b.data.featured) - Number(a.data.featured) ||
      b.data.posted.getTime() - a.data.posted.getTime()
  );
}
