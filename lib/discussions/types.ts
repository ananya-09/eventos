export interface Creator {
  id: string;
  name: string;
  image: string | null;
  email?: string;
}

export interface ChannelOverview {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  categoryId: string;
  communityId: string;
}

export interface CategoryWithChannels {
  id: string;
  name: string;
  channels: (ChannelOverview & { postsCount: number })[];
}

export interface ThreadReply {
  id: string;
  content: string;
  createdAt: string;
  author: Creator;
  postId: string;
}

export interface ChannelPost {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  likesCount: number;
  commentsCount: number;
  author: Creator;
  channelId: string | null;
  replies?: ThreadReply[];
  latestReplyAt?: string;
  latestReplyUser?: Creator;
  participants?: Creator[];
}
