import { getCollection, type CollectionEntry } from "astro:content";

export type Series = CollectionEntry<"series">;

/** Active series only, in a stable order. */
export async function getActiveSeries(): Promise<Series[]> {
  const all = await getCollection("series", ({ data }) => data.active);
  return all.sort((a, b) => a.data.name.localeCompare(b.data.name));
}
