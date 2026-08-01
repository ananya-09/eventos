import { Suspense } from "react";
import { headers } from "next/headers";
import CommunitiesClient from "./CommunitiesClient";

export const metadata = {
  title: "Discover Communities | Eventos",
  description: "Find and join communities that match your interests on Eventos.",
};

// Type definition for Community
type Community = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  banner: string | null;
  isMember?: boolean;
  _count: {
    members: number;
    posts: number;
  };
};

export default async function CommunitiesPage() {
  // 1. Fetch communities from the API with caching disabled
  let communities: Community[] = [];
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');

  try {
    const headersList = await headers();
    const cookieHeader = headersList.get('cookie') || '';

    const res = await fetch(`${baseUrl}/api/communities`, {
      cache: "no-store",
      headers: { cookie: cookieHeader },
    });

    if (res.ok) {
      const data = await res.json();
      if (data.success && data.communities) {
        communities = data.communities;
      }
    }
  } catch (error) {
    console.error("Failed to fetch communities:", error);
  }

  return (
    <div className="relative w-full">
      {/* Subtle glow effect */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-[#34629f]/5 rounded-full blur-[120px] pointer-events-none z-0" />

      {/* Main Content Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10 w-full flex flex-col items-center">
        
        {/* Hero Section matching homepage style */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center justify-center px-4 py-1.5 mb-6 rounded-full border border-[#e1eaf4] bg-white/70 backdrop-blur-md shadow-sm">
            <span className="text-sm font-medium text-[#2e68a8] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#34629f]" />
              Organizations • Events • Audience
            </span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight mb-6 leading-tight">
            Discover your next <span className="text-[#34629f]">community</span>.
          </h1>
          
          <p className="text-xl text-slate-500 leading-relaxed">
            Find premium hubs for organizations to share updates, host events, and engage with their audience in immersive feeds.
          </p>
        </div>

        {/* Client Component with Suspense for Search, Filtering, and Animations */}
        <Suspense fallback={
          <div className="flex flex-col items-center justify-center py-32">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#34629f] mb-4" />
            <p className="text-slate-500 font-medium animate-pulse">Loading communities...</p>
          </div>
        }>
          <CommunitiesClient initialCommunities={communities} />
        </Suspense>
        
      </div>
    </div>
  );
}
