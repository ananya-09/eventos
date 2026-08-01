import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { getCommunityDiscussionCategories } from "@/lib/discussions/queries";
import { canPostInDiscussions } from "@/lib/discussions/permissions";
import DiscussionComposer from "../components/DiscussionComposer";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

interface NewDiscussionPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ channel?: string }>;
}

export default async function NewDiscussionPage({
  params,
  searchParams,
}: NewDiscussionPageProps) {
  const { slug } = await params;
  const { channel: channelSlug } = await searchParams;

  const community = await prisma.community.findUnique({
    where: { slug },
    select: { id: true, name: true },
  });

  if (!community) {
    notFound();
  }

  const categories = await getCommunityDiscussionCategories(slug);

  let defaultChannelId: string | undefined;
  if (channelSlug) {
    for (const cat of categories) {
      const match = cat.channels.find((ch) => ch.slug === channelSlug);
      if (match) {
        defaultChannelId = match.id;
        break;
      }
    }
  }

  const session = await getServerSession(authOptions);
  let isMember = false;

  if (session?.user?.email) {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    });
    if (user) {
      isMember = await canPostInDiscussions(user.id, community.id);
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-8">
      <Link
        href={`/communities/${slug}/discussions`}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-[#34629f] transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
        Back to discussions
      </Link>

      <div className="space-y-1">
        <p className="text-[10px] font-extrabold text-[#34629f] uppercase tracking-widest">
          {community.name}
        </p>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          New discussion
        </h1>
        <p className="text-sm text-slate-500">
          Your thread will appear in the selected channel and open for community replies.
        </p>
      </div>

      <DiscussionComposer
        communitySlug={slug}
        categories={categories}
        isMember={isMember}
        mode="page"
        defaultChannelId={defaultChannelId}
      />
    </div>
  );
}
