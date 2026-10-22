/**
 * Event platforms. Swapping or adding one (Luma, say) means editing this file;
 * pages only ever see normalized events and the provider's label.
 */
export const EVENT_FEEDS = [
  {
    provider: "meetup",
    url: "https://www.meetup.com/syracuse-software-development-meetup/events/ical/",
  },
  // later: { provider: "luma", url: "<Luma calendar .ics URL>" },
];

/** Shown in "via {label}" next to event lists. Manual events have no label. */
export const PROVIDER_LABELS: Record<string, string> = {
  meetup: "Meetup",
  luma: "Luma",
};
