import { ReactNode, Suspense } from "react";
import Image from "next/image";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { Users, MessageSquare, MapPin } from "lucide-react";
import CommunityActions from "./components/CommunityActions";
import CommunityTabs from "./components/CommunityTabs";
import PremiumImage from "@/components/ui/PremiumImage";
import { getCuratedCommunityBanner, SHARED_OVERLAYS } from "@/lib/media";
import ScrollToTop from "@/components/ui/scroll-to-top";

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

export default async function CommunityLayout(props: {
  children: ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await props.params;

  let community: Community | null = null;
  let isMember = false;

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
        isMember = data.isMember || false;
      }
    }
  } catch (error) {
    console.error(`Failed to fetch community data in layout for ${slug}:`, error);
  }

  if (!community) {
    notFound();
  }

  return (
    <div className="relative w-full min-h-screen">
      <ScrollToTop />
      {/* Community Hero Section */}
      <div className="w-full bg-white border-b border-slate-200 shadow-sm relative overflow-hidden">
        {/* Subtle grid pattern aesthetic */}
        <div 
          className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none" 
          style={{ backgroundImage: 'linear-gradient(#34629f 1px, transparent 1px), linear-gradient(90deg, #34629f 1px, transparent 1px)', backgroundSize: '40px 40px' }} 
        />
        
        {/* Banner Area */}
        <div className="w-full h-48 md:h-64 lg:h-72 relative overflow-hidden bg-slate-100">
          <PremiumImage 
            src={community.banner || getCuratedCommunityBanner(community.slug)} 
            alt={`${community.name} banner`} 
            fill
            className="object-cover saturate-[0.80] contrast-[0.90] brightness-[0.75] transition-all duration-500"
            sizes="100vw"
            priority
          />
          {/* Centralized premium ambient cinematic dark overlay */}
          <div className={SHARED_OVERLAYS.heroOverlay} />
        </div>

        {/* Community Info (Overlapping Banner matching GDG Lucknow layout exactly) */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6 w-full">
            
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6 pb-6 pt-4 flex-1">
              
              {/* Borderless Premium Avatar Box - Enlarged to w-36, fixed-anchored layout */}
              <div className="relative z-20 w-28 h-28 md:w-36 md:h-36 rounded-[32px] shadow-lg -mt-14 md:-mt-18 overflow-hidden flex items-center justify-center shrink-0 bg-white">
                {community.image ? (
                  <Image 
                    src={community.image} 
                    alt={community.name} 
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 112px, 144px"
                    priority
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-[#34629f] to-[#2e68a8] flex items-center justify-center text-white font-bold text-4xl">
                    {community.name.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>

              {/* Text Details & GDG style info */}
              <div className="flex-1 text-center md:text-left pt-2 md:pt-0">
                <div className="flex items-center gap-3 mb-3 justify-center md:justify-start">
                  <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight md:whitespace-nowrap">
                    {community.name}
                  </h1>
                </div>
                
                {/* GDG Style Metadata Row */}
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs font-semibold text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>{community._count?.members?.toLocaleString() || 0} Members</span>
                  </div>
                  
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-300 hidden md:block" />
                  
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>Gorakhpur, Uttar Pradesh, India</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions (Join/Joined, Post Button) aligned to the right */}
            <div className="flex items-center justify-center lg:justify-end gap-3 pb-6 lg:pb-0 relative z-20 shrink-0 lg:pt-3">
              <CommunityActions slug={slug} initialIsJoined={isMember} />
            </div>

          </div>
        </div>
      </div>

      {/* Sticky Tab Navigation Bar */}
      <div className="w-full bg-white border-b border-slate-200 sticky top-[64px] z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
          <CommunityTabs slug={slug} />
        </div>
      </div>

      {/* Main Tab Content Area */}
      <div className="py-12 relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Glow effect */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#34629f]/5 rounded-full blur-[120px] pointer-events-none z-0" />
        
        <Suspense fallback={
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#34629f]" />
          </div>
        }>
          <div className="relative z-10 w-full">
            {props.children}
          </div>
        </Suspense>
      </div>
    </div>
  );
}
