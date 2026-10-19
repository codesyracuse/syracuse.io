import { SITE_URL } from "./site";
import type { SiteEvent } from "./events";

const ORGANIZER = {
  "@type": "Organization",
  name: "CODES (Coalition of Digital Engagement in Syracuse)",
  url: `${SITE_URL}/codes`,
};

/** schema.org Event for an upcoming meetup. */
export function eventJsonLd(event: SiteEvent, pageUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.title,
    startDate: event.start.toISOString(),
    ...(event.end && { endDate: event.end.toISOString() }),
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    location: {
      "@type": "Place",
      name: event.venueName ?? event.location ?? "Syracuse, NY",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Syracuse",
        addressRegion: "NY",
        addressCountry: "US",
      },
    },
    url: event.url ?? pageUrl,
    isAccessibleForFree: true,
    organizer: ORGANIZER,
  };
}
