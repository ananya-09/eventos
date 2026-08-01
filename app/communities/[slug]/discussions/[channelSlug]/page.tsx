import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  getDiscussionChannel,
  getChannelPosts,
  getCommunityDiscussionCategories,
} from "@/lib/discussions/queries";
import { canPostInDiscussions } from "@/lib/discussions/permissions";
import DiscussionFeed from "@/app/communities/[slug]/discussions/[channelSlug]/components/DiscussionFeed";

interface ChannelPageProps {
  params: Promise<{
    slug: string;
    channelSlug: string;
  }>;
}

export default async function ChannelPage({ params }: ChannelPageProps) {
  const { slug, channelSlug } = await params;

  const channel = await getDiscussionChannel(slug, channelSlug);

  if (!channel) {
    notFound();
  }

  const [posts, categories] = await Promise.all([
    getChannelPosts(channel.id),
    getCommunityDiscussionCategories(slug),
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

  return (
    <DiscussionFeed
      initialPosts={posts}
      channel={channel}
      communitySlug={slug}
      categories={categories}
      isMember={isMember}
    />
  );
}
