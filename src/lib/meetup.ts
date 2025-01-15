const MEETUP_API_URL = 'https://api.meetup.com/gql';
const MEETUP_GROUP_URLNAME = 'syracuse-software-development-meetup';

interface MeetupEvent {
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
  };  
  host: { name: string; memberPhoto: { source: string } };
  hostPhoto: { source: string };
}

export async function getUpcomingEvents(): Promise<MeetupEvent[]> {
  const query = `
    query {
    groupByUrlname(urlname: "syracuse-software-development-meetup") {
    upcomingEvents(input: { first: 3 }) {
      edges {
        node {
          title
          description
          dateTime
          eventUrl
          venue {
            name
            address
            city
            state
            postalCode
            venueType
          }
          images {
            baseUrl
            source
          }
          host {
            name
            memberPhoto { source }
          }
        }
      }
    }
  }
    }
  `;

  const response = await fetch(MEETUP_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // You'll need to add your Meetup API key here
      'Authorization': `Bearer ${import.meta.env.MEETUP_API_KEY}`,
    },
    body: JSON.stringify({ query }),
  });

  const data = await response.json();

  return data.data.groupByUrlname.upcomingEvents.edges.map(({ node }: any) => ({
    name: node.title,
    description: node.description,
    dateTime: node.dateTime,
    url: node.eventUrl,
    images: node.images,
    venue: node.venue,
    eventUrl: node.eventUrl,
    hostPhoto: node.host.memberPhoto,
    host: node.host,
  }));
} 