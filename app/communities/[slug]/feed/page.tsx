import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { FileText } from "lucide-react";
import PostFeed from "../components/PostFeed";

type Community = {
  id: string;
  name: string;
  slug: string;
};

type Post = {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  author: {
    id?: string;
    name: string;
    image: string | null;
  };
  _count: {
    likes: number;
    comments: number;
  };
};

export default async function FeedTab(
  context: { params: Promise<{ slug: string }> }
) {
  const { slug } = await context.params;

  let community: Community | null = null;
  let posts: Post[] = [];
  let isMember = false;

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');

  try {
    const headersList = await headers();
    const cookieHeader = headersList.get('cookie') || '';

    const [communityRes, postsRes] = await Promise.all([
      fetch(`${baseUrl}/api/communities/${slug}`, {
        cache: "no-store",
        headers: { cookie: cookieHeader },
      }),
      fetch(`${baseUrl}/api/communities/${slug}/posts`, {
        cache: "no-store",
        headers: { cookie: cookieHeader },
      }),
    ]);

    if (communityRes.ok) {
      const data = await communityRes.json();
      if (data.success && data.community) {
        community = data.community;
        isMember = data.isMember || false;
      }
    }

    if (postsRes.ok) {
      const data = await postsRes.json();
      if (data.success && data.posts) {
        posts = data.posts;
      }
    }
  } catch (error) {
    console.error(`Failed to fetch feed data for ${slug}:`, error);
  }

  if (!community) {
    notFound();
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="mb-6 flex items-center gap-3 border-b border-slate-200/60 pb-4">
        <FileText className="w-5 h-5 text-[#34629f]" />
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Recent Posts</h2>
      </div>

      <PostFeed 
        initialPosts={posts} 
        communitySlug={community.slug} 
        isMember={isMember} 
      />
    </div>
  );
}
