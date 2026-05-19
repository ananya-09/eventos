import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  getCommunityDiscussionCategories,
  getDiscussionsOverview,
  getTrendingChannels,
} from "@/lib/discussions/queries";
import { canPostInDiscussions } from "@/lib/discussions/permissions";
import DiscussionsOverviewHeader from "./components/DiscussionsOverviewHeader";
import DiscussionsEmptyState from "./components/DiscussionsEmptyState";
import RecentDiscussionsList from "./components/RecentDiscussionsList";
import Link from "next/link";
import { Hash, TrendingUp } from "lucide-react";

interface DiscussionsPageProps {
  params: Promise<{ slug: string }>;
}

export default async function DiscussionsPage({ params }: DiscussionsPageProps) {
  const { slug } = await params;

  const [, overview, trending] = await Promise.all([
    getCommunityDiscussionCategories(slug),
    getDiscussionsOverview(slug),
    getTrendingChannels(slug, 5),
  ]);

  const session = await getServerSession(authOptions);
  let isMember = false;

  if (session?.user?.email) {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    });
    const community = await prisma.community.findUnique({
      where: { slug },
      select: { id: true },
    });
    if (user && community) {
      isMember = await canPostInDiscussions(user.id, community.id);
    }
  }

  const hasDiscussions = overview.totalDiscussions > 0;

  return (
    <div className="space-y-6">
      <DiscussionsOverviewHeader
        communitySlug={slug}
        totalDiscussions={overview.totalDiscussions}
        totalChannels={overview.totalChannels}
        isMember={isMember}
      />

      {!hasDiscussions ? (
        <DiscussionsEmptyState communitySlug={slug} isMember={isMember} />
      ) : (
        <>
          {trending.length > 0 && (
            <div className="glass-surface rounded-2xl p-4 sm:p-5 border border-slate-200/60 space-y-3">
              <div className="flex items-center gap-2 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">
                <TrendingUp className="w-3.5 h-3.5 text-amber-500" />
                Active channels
              </div>
              <div className="flex flex-wrap gap-2">
                {trending.map((ch) => (
                  <Link
                    key={ch.id}
                    href={`/communities/${slug}/discussions/${ch.slug}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-[#34629f]/10 text-xs font-bold text-slate-600 hover:text-[#34629f] border border-slate-100 hover:border-[#34629f]/20 transition-all"
                  >
                    <Hash className="w-3.5 h-3.5" />
                    {ch.name}
                    <span className="text-[9px] font-extrabold text-slate-400">
                      {ch.postsCount}
                    </span>
                  </Link>
                ))}
              </div>
              <p className="text-[11px] text-slate-500">
                Select a channel from the sidebar, or{" "}
                <Link
                  href={`/communities/${slug}/discussions/new`}
                  className="font-bold text-[#34629f] hover:underline"
                >
                  start a new discussion
                </Link>
                .
              </p>
            </div>
          )}

          <RecentDiscussionsList
            posts={overview.recentPosts}
            communitySlug={slug}
          />
        </>
      )}
    </div>
  );
}
