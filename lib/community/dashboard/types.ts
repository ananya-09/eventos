export interface Creator {
  id: string;
  name: string;
  image: string | null;
  email?: string;
}

export interface CommunityOverview {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  banner: string | null;
  createdAt: string;
  memberCount: number;
  postCount: number;
  eventCount: number;
}

export interface FeaturedEvent {
  id: string;
  title: string;
  description: string;
  banner: string | null;
  location: string;
  startDate: string;
  endDate: string;
  creator: Creator;
}

export interface DiscussionPost {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  commentsCount: number;
  likesCount: number;
  author: Creator;
}

export interface VirtualChannel {
  id: string;
  name: string;
  description: string;
  postCount: number;
}

export interface CommunityLeader {
  id: string;
  name: string;
  image: string | null;
  role: string;
  joinedAt: string;
}

export interface DashboardData {
  overview: CommunityOverview;
  featuredEvent: FeaturedEvent | null;
  discussions: DiscussionPost[];
  trendingChannels: VirtualChannel[];
  leaders: CommunityLeader[];
  upcomingMiniEvents: FeaturedEvent[];
  activeMembersPreview: { id: string; name: string; image: string | null }[];
}
