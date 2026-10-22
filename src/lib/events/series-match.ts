import { normalizeTitle } from "./dedupe";

interface Matcher {
  slug: string;
  match: string;
}

function matches(title: string, pattern: string): boolean {
  const asRegex = pattern.match(/^\/(.+)\/([a-z]*)$/);
  if (asRegex) return new RegExp(asRegex[1], asRegex[2]).test(title);
  // Ignore case, spacing and punctuation so "Open Hack" matches "OpenHack".
  return normalizeTitle(title)
    .replace(/ /g, "")
    .includes(normalizeTitle(pattern).replace(/ /g, ""));
}

/** Slug of the first series whose `match` fits the title, if any. */
export function matchSeries(
  title: string,
  series: Matcher[]
): string | undefined {
  return series.find((s) => matches(title, s.match))?.slug;
}
