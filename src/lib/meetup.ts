import eventsData from "../data/events.json";

export interface MeetupEvent {
  name: string;
  description: string;
  dateTime: string;
  endTime?: string;
  duration?: string;
  eventType?: string;
  status?: string;
  url: string;
  goingCount?: number;
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

const allEvents = eventsData as MeetupEvent[];

export function getUpcomingEvents(): MeetupEvent[] {
  const now = new Date();
  return allEvents
    .filter((event) => new Date(event.dateTime) >= now)
    .sort(
      (a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime()
    );
}

export function getPastEvents(): MeetupEvent[] {
  const now = new Date();
  return allEvents
    .filter((event) => new Date(event.dateTime) < now)
    .sort(
      (a, b) => new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime()
    );
}

export function getAllEvents(): MeetupEvent[] {
  return allEvents;
}
