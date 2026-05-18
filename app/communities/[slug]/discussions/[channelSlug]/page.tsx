import { notFound } from "next/navigation";
import { getDiscussionChannel, getChannelPosts } from "@/lib/discussions/queries";
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

  const posts = await getChannelPosts(channel.id);

  return (
    <DiscussionFeed
      initialPosts={posts}
      channel={channel}
      communitySlug={slug}
    />
  );
}
