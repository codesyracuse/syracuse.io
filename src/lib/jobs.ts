import { getCollection, type CollectionEntry } from "astro:content";
import { selectActiveJobs } from "./jobs-select";

export type Job = CollectionEntry<"jobs">;

/** Unexpired jobs at build time. If none, Jobs is hidden from the nav and home. */
export async function getActiveJobs(now = new Date()): Promise<Job[]> {
  return selectActiveJobs(await getCollection("jobs"), now);
}
