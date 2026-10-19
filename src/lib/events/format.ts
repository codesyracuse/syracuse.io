import { TIME_ZONE } from "../site";

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function parts(date: Date) {
  const out: Record<string, string> = {};
  for (const p of new Intl.DateTimeFormat("en-US", {
    timeZone: TIME_ZONE,
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).formatToParts(date)) {
    out[p.type] = p.value;
  }
  return out;
}

/** "2026-10-13", the calendar day in Syracuse regardless of server timezone. */
export function localDateKey(date: Date): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

/** { weekday: "Tue", month: "Oct", day: "13" } */
export function dateParts(date: Date) {
  const p = parts(date);
  return { weekday: p.weekday, month: p.month, day: p.day };
}

/** "Oct 13" */
export function monthDay(date: Date): string {
  const p = parts(date);
  return `${p.month} ${p.day}`;
}

/** "TUE 10·13" */
export function rowDate(date: Date): string {
  const [, m, d] = localDateKey(date).split("-");
  return `${parts(date).weekday.toUpperCase()} ${m}·${d}`;
}

/** "6pm" or "6:30pm" */
export function timeShort(date: Date): string {
  const p = parts(date);
  const ap = p.dayPeriod.toLowerCase();
  return p.minute === "00" ? `${p.hour}${ap}` : `${p.hour}:${p.minute}${ap}`;
}

/** "6:00pm" */
export function timeFull(date: Date): string {
  const p = parts(date);
  return `${p.hour}:${p.minute}${p.dayPeriod.toLowerCase()}`;
}

/** "2014-04" -> "April 2014" */
export function sinceLabel(since: string): string {
  const [y, m] = since.split("-");
  return `${MONTHS[Number(m) - 1]} ${y}`;
}

/**
 * "2026-10-13" for a date-only YAML value (`event_date: 2026-10-13`). Those
 * parse as UTC midnight, so reading them in Syracuse time would give Oct 12.
 */
export function calendarDay(date: Date): string {
  return date.toISOString().slice(0, 10);
}
