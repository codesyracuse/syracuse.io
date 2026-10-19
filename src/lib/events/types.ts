export interface FeedEvent {
  id: string;
  title: string;
  start: Date;
  end?: Date;
  location?: string;
  /** RSVP page on the event platform. */
  url?: string;
  provider: string;
  /** Series slug, once assigned. */
  series?: string;
}
