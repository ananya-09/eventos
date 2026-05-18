import { headers } from "next/headers";
import EventsClient from "@/app/communities/[slug]/events/EventsClient";

type Creator = {
  id: string;
  name: string;
  image: string | null;
  email: string;
};

type EventType = {
  id: string;
  title: string;
  description: string;
  banner: string | null;
  location: string;
  startDate: string;
  endDate: string;
  createdAt: string;
  creator: Creator;
};

export default async function EventsPage(
  context: { params: Promise<{ slug: string }> }
) {
  const { slug } = await context.params;

  let upcomingEvents: EventType[] = [];
  let pastEvents: EventType[] = [];
  let isMember = false;

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');

  try {
    const headersList = await headers();
    const cookieHeader = headersList.get('cookie') || '';

    const [communityRes, eventsRes] = await Promise.all([
      fetch(`${baseUrl}/api/communities/${slug}`, {
        cache: "no-store",
        headers: { cookie: cookieHeader },
      }),
      fetch(`${baseUrl}/api/communities/${slug}/events`, {
        cache: "no-store",
        headers: { cookie: cookieHeader },
      }),
    ]);

    if (communityRes.ok) {
      const data = await communityRes.json();
      if (data.success) {
        isMember = data.isMember || false;
      }
    }

    if (eventsRes.ok) {
      const data = await eventsRes.json();
      if (data.success) {
        upcomingEvents = data.upcomingEvents || [];
        pastEvents = data.pastEvents || [];
      }
    }
  } catch (error) {
    console.error(`Failed to load events page for community ${slug}:`, error);
  }

  return (
    <EventsClient 
      slug={slug}
      initialUpcomingEvents={upcomingEvents}
      initialPastEvents={pastEvents}
      isMember={isMember}
    />
  );
}
