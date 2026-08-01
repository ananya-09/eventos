import { notFound } from "next/navigation";
import { getCommunityDashboardData } from "@/lib/community/dashboard";
import DashboardShell from "@/app/communities/[slug]/components/dashboard/DashboardShell";
import CommunityHero from "@/app/communities/[slug]/components/dashboard/CommunityHero";
import FeaturedEventCard from "@/app/communities/[slug]/components/dashboard/FeaturedEventCard";
import DiscussionsPreview from "@/app/communities/[slug]/components/dashboard/DiscussionsPreview";
import TrendingChannels from "@/app/communities/[slug]/components/dashboard/TrendingChannels";
import CommunityLeaders from "@/app/communities/[slug]/components/dashboard/CommunityLeaders";
import SidebarWidgets from "@/app/communities/[slug]/components/dashboard/SidebarWidgets";

export default async function CommunityRootPage(
  context: { params: Promise<{ slug: string }> }
) {
  const { slug } = await context.params;

  const data = await getCommunityDashboardData(slug);

  if (!data) {
    notFound();
  }

  return (
    <DashboardShell>
      {/* 1. Community Hero Overview */}
      <CommunityHero overview={data.overview} slug={slug} />

      {/* 3. Core Left Side Main column blocks */}
      <FeaturedEventCard event={data.featuredEvent} slug={slug} />
      <DiscussionsPreview posts={data.discussions} slug={slug} />

      {/* 4. Core Right Side Sidebar column widgets */}
      <TrendingChannels channels={data.trendingChannels} />
      <CommunityLeaders leaders={data.leaders} />
      <SidebarWidgets 
        miniEvents={data.upcomingMiniEvents} 
        activeMembers={data.activeMembersPreview}
        slug={slug}
      />
    </DashboardShell>
  );
}
