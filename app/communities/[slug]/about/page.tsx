import { headers } from "next/headers";
import { notFound } from "next/navigation";
import AboutClient from "@/app/communities/[slug]/about/AboutClient";

type Community = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  banner: string | null;
  createdAt: string;
  _count: {
    members: number;
    posts: number;
  };
};

type Organizer = {
  id: string;
  name: string;
  image: string | null;
  email: string;
  role: string;
  joinedAt: string;
};

type FeaturedMember = {
  id: string;
  name: string;
  image: string | null;
  joinedAt: string;
};

type Socials = {
  website?: string;
  discord?: string;
  github?: string;
  twitter?: string;
  linkedin?: string;
};

export default async function AboutTab(
  context: { params: Promise<{ slug: string }> }
) {
  const { slug } = await context.params;

  let community: Community | null = null;
  let organizers: Organizer[] = [];
  let featuredMembers: FeaturedMember[] = [];
  let tags: string[] = [];
  let socials: Socials = {};

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');

  try {
    const headersList = await headers();
    const cookieHeader = headersList.get('cookie') || '';

    const communityRes = await fetch(`${baseUrl}/api/communities/${slug}`, {
      cache: "no-store",
      headers: { cookie: cookieHeader },
    });

    if (communityRes.ok) {
      const data = await communityRes.json();
      if (data.success && data.community) {
        community = data.community;
        organizers = data.organizers || [];
        featuredMembers = data.featuredMembers || [];
        tags = data.tags || [];
        socials = data.socials || {};
      }
    }
  } catch (error) {
    console.error(`Failed to fetch community about details for ${slug}:`, error);
  }

  if (!community) {
    notFound();
  }

  return (
    <AboutClient
      community={community}
      organizers={organizers}
      featuredMembers={featuredMembers}
      tags={tags}
      socials={socials}
    />
  );
}
