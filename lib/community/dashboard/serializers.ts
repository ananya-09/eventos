import { CommunityOverview, FeaturedEvent, DiscussionPost, CommunityLeader, VirtualChannel, DashboardData } from "./types";

export function serializeDashboardPayload(
  community: any,
  upcomingEvents: any[],
  recentPosts: any[],
  organizers: any[],
  activeMembers: any[]
): DashboardData {
  // 1. Map Community Overview
  const overview: CommunityOverview = {
    id: community.id,
    name: community.name,
    slug: community.slug,
    description: community.description,
    image: community.image,
    banner: community.banner,
    createdAt: community.createdAt.toISOString(),
    memberCount: community._count.members,
    postCount: community._count.posts,
    eventCount: community._count.events,
  };

  // 2. Map Featured Event vs Mini Upcoming Events
  let featuredEvent: FeaturedEvent | null = null;
  const upcomingMiniEvents: FeaturedEvent[] = [];

  const formattedEvents: FeaturedEvent[] = upcomingEvents.map((evt) => ({
    id: evt.id,
    title: evt.title,
    description: evt.description,
    banner: evt.banner,
    location: evt.location,
    startDate: evt.startDate.toISOString(),
    endDate: evt.endDate.toISOString(),
    creator: {
      id: evt.creator.id,
      name: evt.creator.name,
      image: evt.creator.image,
      email: evt.creator.email,
    },
  }));

  if (formattedEvents.length > 0) {
    featuredEvent = formattedEvents[0];
    upcomingMiniEvents.push(...formattedEvents.slice(1));
  }

  // 3. Map Discussion Previews
  const discussions: DiscussionPost[] = recentPosts.map((post) => ({
    id: post.id,
    title: post.title,
    content: post.content,
    createdAt: post.createdAt.toISOString(),
    commentsCount: post._count.comments,
    likesCount: post._count.likes,
    author: {
      id: post.author.id,
      name: post.author.name,
      image: post.author.image,
    },
  }));

  // 4. Map leaders and ensure community creator is represented
  const leaders: CommunityLeader[] = organizers.map((org) => ({
    id: org.user.id,
    name: org.user.name,
    image: org.user.image,
    role: org.role,
    joinedAt: org.joinedAt.toISOString(),
  }));

  if (!leaders.some((l) => l.id === community.creatorId)) {
    leaders.unshift({
      id: community.creator.id,
      name: community.creator.name,
      image: community.creator.image,
      role: "ADMIN",
      joinedAt: community.createdAt.toISOString(),
    });
  }

  // 5. Generate virtual trending subchannels/tags dynamically based on post counts
  const totalPosts = community._count.posts;
  const trendingChannels: VirtualChannel[] = [
    {
      id: "announcements",
      name: "announcements",
      description: "Official community news and key schedule alerts",
      postCount: Math.max(1, Math.floor(totalPosts * 0.15)),
    },
    {
      id: "general",
      name: "general-chat",
      description: "Casual developer talks, hangouts, and networking",
      postCount: Math.max(2, Math.floor(totalPosts * 0.5)),
    },
    {
      id: "help",
      name: "q-and-a",
      description: "Ask questions, resolve bugs, and share resources",
      postCount: Math.max(1, Math.floor(totalPosts * 0.25)),
    },
    {
      id: "events",
      name: "events-discussion",
      description: "Coordinate, review, and plan hackathons or meetups",
      postCount: Math.max(1, Math.floor(totalPosts * 0.1)),
    },
  ];

  // 6. Map active members preview circles
  const activeMembersPreview = activeMembers.map((feat) => ({
    id: feat.user.id,
    name: feat.user.name,
    image: feat.user.image,
  }));

  return {
    overview,
    featuredEvent,
    discussions,
    trendingChannels,
    leaders,
    upcomingMiniEvents,
    activeMembersPreview,
  };
}
