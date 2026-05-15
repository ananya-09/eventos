export interface Post {
  id: string;
  title: string;
  content: string;
  authorId: string;
  communityId: string;
  createdAt: Date;
  updatedAt: Date;
}
