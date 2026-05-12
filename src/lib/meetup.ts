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
  groupId?: string;
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

function startOfToday(): Date {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

export function getUpcomingEvents(): MeetupEvent[] {
  const today = startOfToday();
  return allEvents
    .filter((event) => new Date(event.dateTime) >= today)
    .sort(
      (a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime()
    );
}

export function getPastEvents(): MeetupEvent[] {
  const today = startOfToday();
  return allEvents
    .filter((event) => new Date(event.dateTime) < today)
    .sort(
      (a, b) => new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime()
    );
}

export function getAllEvents(): MeetupEvent[] {
  return allEvents;
}

export function getEventsByGroup(groupId: string): MeetupEvent[] {
  return allEvents
    .filter((event) => event.groupId === groupId)
    .sort(
      (a, b) => new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime()
    );
}

export function getMostRecentEventDate(groupId: string): Date | null {
  const events = allEvents.filter((event) => event.groupId === groupId);
  if (events.length === 0) return null;
  return new Date(
    Math.max(...events.map((e) => new Date(e.dateTime).getTime()))
  );
}
