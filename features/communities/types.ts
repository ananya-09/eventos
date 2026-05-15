export interface Community {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  image?: string | null;
  banner?: string | null;
  createdAt: Date;
}

export interface CommunityMember {
  id: string;
  userId: string;
  communityId: string;
  role: 'ADMIN' | 'MODERATOR' | 'MEMBER';
  joinedAt: Date;
}
