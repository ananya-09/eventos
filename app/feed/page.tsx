import { Suspense } from "react";
import FeedList from "./FeedList";

// Type definition to match the expected API response
type Post = {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  author: {
    name: string;
    image: string | null;
  };
  community: {
    name: string;
    slug: string;
  };
  _count: {
    likes: number;
    comments: number;
  };
};

export default async function FeedPage() {
  // Fetch posts from our API with no caching
  let posts: Post[] = [];
  try {
    const res = await fetch("http://localhost:3000/api/posts", {
      cache: "no-store",
    });

    if (res.ok) {
      const data = await res.json();
      if (data.success && data.posts) {
        posts = data.posts;
      }
    }
  } catch (error) {
    console.error("Failed to fetch feed:", error);
  }

  return (
    <div className="relative py-12 px-4 sm:px-6 lg:px-8 w-full">
      {/* Decorative gradient background elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-[#34629f]/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10">
        <div className="mb-12 text-center">
          <div className="inline-flex items-center justify-center px-4 py-1.5 mb-6 rounded-full border border-blue-100 bg-white/50 backdrop-blur-sm shadow-sm">
            <span className="text-sm font-medium text-[#2e68a8]">
              Your Community Feed
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
            Discover, interact, and <span className="text-[#34629f]">engage.</span>
          </h1>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto">
            Stay updated with the latest events, announcements, and discussions from the communities you follow.
          </p>
        </div>

        <Suspense fallback={
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#34629f]" />
          </div>
        }>
          <FeedList posts={posts} />
        </Suspense>
      </div>
    </div>
  );
}
