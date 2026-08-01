import { ReactNode, Suspense } from "react";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { Users, MapPin } from "lucide-react";
import CommunityActions from "./components/CommunityActions";
import CommunityTabs from "./components/CommunityTabs";
import CommunityHeroBranding from "./components/CommunityHeroBranding";
import ScrollToTop from "@/components/ui/scroll-to-top";
import CommunityUrlDisplay from "./components/CommunityUrlDisplay";

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
  let canManageBranding = false;

  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

  try {
    const headersList = await headers();
    const cookieHeader = headersList.get("cookie") || "";

    const communityRes = await fetch(`${baseUrl}/api/communities/${slug}`, {
      cache: "no-store",
      headers: { cookie: cookieHeader },
    });

    if (communityRes.ok) {
      const data = await communityRes.json();
      if (data.success && data.community) {
        community = data.community;
        isMember = data.isMember || false;
        canManageBranding = data.canManageBranding || false;
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
      <div className="w-full bg-white border-b border-slate-200 shadow-sm relative overflow-hidden">
        <div
          className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(#34629f 1px, transparent 1px), linear-gradient(90deg, #34629f 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        <CommunityHeroBranding
          slug={slug}
          name={community.name}
          initialBanner={community.banner}
          initialLogo={community.image}
          canManageBranding={canManageBranding}
          infoSection={
            <div className="flex-1 text-center md:text-left pt-2 md:pt-0">
              <div className="flex flex-col md:flex-row md:items-center gap-2.5 mb-3 justify-center md:justify-start">
                <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight md:whitespace-nowrap">
                  {community.name}
                </h1>
                <div className="flex justify-center md:justify-start shrink-0">
                  <CommunityUrlDisplay slug={slug} />
                </div>
              </div>
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
          }
          actionsSection={
            <div className="flex items-center justify-center lg:justify-end gap-3 pb-6 lg:pb-0 relative z-20 shrink-0 lg:pt-3">
              <CommunityActions
                slug={slug}
                name={community.name}
                initialIsJoined={isMember}
                canManageBranding={canManageBranding}
              />
            </div>
          }
        />
      </div>

      <div className="w-full bg-white border-b border-slate-200 sticky top-[64px] z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
          <CommunityTabs slug={slug} />
        </div>
      </div>

      <div className="py-12 relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#34629f]/5 rounded-full blur-[120px] pointer-events-none z-0" />
        <Suspense
          fallback={
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#34629f]" />
            </div>
          }
        >
          <div className="relative z-10 w-full">{props.children}</div>
        </Suspense>
      </div>
    </div>
  );
}
