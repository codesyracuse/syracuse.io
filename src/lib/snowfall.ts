// Season snowfall for SYR (Hancock Intl) via ACIS — the NOAA regional
// climate centers' API. No key required. https://www.rcc-acis.org/docs_webservices.html
const ACIS_URL = "https://data.rcc-acis.org/StnData";

// Last completed season's total; the render fallback when ACIS is unreachable.
const FALLBACK = { inches: "143.1", label: "last winter at SYR" };

export interface Snowfall {
  inches: string;
  label: string;
}

interface AcisResponse {
  data?: [string, string][];
}

/** Season-to-date snowfall in inches for the season starting July 1 of `startYear`, or null. */
async function fetchSeasonTotal(
  startYear: number,
  endDate: string
): Promise<number | null> {
  try {
    const response = await fetch(ACIS_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: AbortSignal.timeout(5000),
      body: JSON.stringify({
        sid: "SYR",
        sdate: `${startYear}-07-01`,
        edate: endDate,
        elems: [
          {
            name: "snow",
            interval: [0, 0, 1],
            duration: "std",
            season_start: [7, 1],
            reduce: "sum",
          },
        ],
      }),
    });
    if (!response.ok) return null;
    const json = (await response.json()) as AcisResponse;
    const last = json.data?.at(-1)?.[1];
    const total = last === undefined ? NaN : parseFloat(last);
    return Number.isNaN(total) ? null : total;
  } catch {
    return null;
  }
}

let cached: { value: Snowfall; at: number } | null = null;
const TTL_MS = 6 * 60 * 60 * 1000;

/**
 * Current-season snowfall for the statusbar. During the snowless months the
 * current season reads 0.0, so fall back to last winter's total — a zero
 * counter in July proves nothing about the snowball.
 */
export async function getSnowfall(): Promise<Snowfall> {
  if (cached && Date.now() - cached.at < TTL_MS) return cached.value;

  const now = new Date();
  const seasonStart =
    now.getMonth() + 1 >= 7 ? now.getFullYear() : now.getFullYear() - 1;
  const today = now.toISOString().slice(0, 10);

  let value: Snowfall | null = null;
  const current = await fetchSeasonTotal(seasonStart, today);
  if (current !== null && current >= 0.5) {
    value = { inches: current.toFixed(1), label: "SYR leads the snowball" };
  } else if (current !== null) {
    const previous = await fetchSeasonTotal(
      seasonStart - 1,
      `${seasonStart}-06-30`
    );
    if (previous !== null) {
      value = { inches: previous.toFixed(1), label: "last winter at SYR" };
    }
  }

  const result = value ?? FALLBACK;
  cached = { value: result, at: Date.now() };
  return result;
}
