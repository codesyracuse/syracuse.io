import eventsData from "../data/events.json";

export interface MeetupEvent {
  name: string;
  description: string;
  dateTime: string;
  url: string;
  images: { baseUrl: string; source: string }[];
  venue: {
    name: string;
    address: string;
    city: string;
    state: string;
    postalCode: string;
    venueType: string;
  } | null;
  host: { name: string; memberPhoto: { source: string } };
  hostPhoto: { source: string };
}

export function getUpcomingEvents(): MeetupEvent[] {
  const now = new Date();
  return (eventsData as MeetupEvent[]).filter(
    (event) => new Date(event.dateTime) >= now
  );
}
