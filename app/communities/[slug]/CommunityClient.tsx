"use client";

import { FileText } from "lucide-react";
import CommunityActions from "./components/CommunityActions";
import PostFeed from "./components/PostFeed";

type Post = {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  author: {
    name: string;
    image: string | null;
  };
  _count: {
    likes: number;
    comments: number;
  };
};

type Community = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  banner: string | null;
  _count: {
    members: number;
    posts: number;
  };
};

export default function CommunityClient({ 
  community, 
  posts,
  initialIsJoined = false
}: { 
  community: Community; 
  posts: Post[];
  initialIsJoined?: boolean;
}) {
  return (
    <div className="w-full flex flex-col items-center">
      <CommunityActions slug={community.slug} initialIsJoined={initialIsJoined} />

      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center gap-3 border-b border-slate-200/60 pb-4">
          <FileText className="w-5 h-5 text-[#34629f]" />
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Recent Posts</h2>
        </div>

        <PostFeed 
          initialPosts={posts} 
          communitySlug={community.slug} 
          isMember={initialIsJoined} 
        />
      </div>
    </div>
  );
}
