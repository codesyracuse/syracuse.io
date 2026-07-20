import type { MeetupEvent } from "./meetup";

const TZ = "America/New_York";

/** "THU 07·16" — the mono date key for event rows. */
export function formatWhen(iso: string): string {
  const d = new Date(iso);
  const weekday = d
    .toLocaleDateString("en-US", { weekday: "short", timeZone: TZ })
    .toUpperCase();
  const [month, day] = d
    .toLocaleDateString("en-US", {
      month: "2-digit",
      day: "2-digit",
      timeZone: TZ,
    })
    .split("/");
  return `${weekday} ${month}·${day}`;
}

/** "6pm" / "5:30pm" */
export function formatTime(iso: string): string {
  const d = new Date(iso);
  return d
    .toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      timeZone: TZ,
    })
    .replace(":00", "")
    .replace(" ", "")
    .toLowerCase();
}

/** "MIDDLE AGES BREWING · 6pm" row meta. */
export function eventWhere(event: MeetupEvent): string {
  const venue = event.venue?.name ?? "location TBA";
  return `${venue} · ${formatTime(event.dateTime)}`;
}

/** "JULY 2026" — month grouping key. */
export function formatMonth(iso: string): string {
  return new Date(iso)
    .toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
      timeZone: TZ,
    })
    .toUpperCase();
}

/** "Today" / "3 days ago" / "May 2, 2026" */
export function formatRelativeDate(date: Date): string {
  const diffMs = Date.now() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  const absolute = date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: TZ,
  });

  if (diffMs < 0) return absolute;
  if (diffDays === 0) return "today";
  if (diffDays === 1) return "yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7);
    return `${weeks} week${weeks > 1 ? "s" : ""} ago`;
  }
  return absolute;
}
