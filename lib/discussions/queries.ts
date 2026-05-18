import { prisma } from "@/lib/prisma";
import { CategoryWithChannels, ChannelPost, ChannelOverview } from "./types";
import { serializeCategoryWithChannels, serializeChannelPost, serializeChannelOverview } from "./serializers";
import { seedCommunityDiscussions } from "./seed";

export async function getCommunityDiscussionCategories(communitySlug: string): Promise<CategoryWithChannels[]> {
  try {
    const community = await prisma.community.findUnique({
      where: { slug: communitySlug },
      select: { id: true },
    });

    if (!community) {
      return [];
    }

    let categories = await prisma.discussionCategory.findMany({
      where: { communityId: community.id },
      include: {
        channels: {
          orderBy: { createdAt: "asc" },
          include: {
            _count: {
              select: { posts: true }
            }
          }
        }
      },
      orderBy: { createdAt: "asc" },
    });

    if (categories.length === 0) {
      await seedCommunityDiscussions(community.id);
      categories = await prisma.discussionCategory.findMany({
        where: { communityId: community.id },
        include: {
          channels: {
            orderBy: { createdAt: "asc" },
            include: {
              _count: {
                select: { posts: true }
              }
            }
          }
        },
        orderBy: { createdAt: "asc" },
      });
    }

    return serializeCategoryWithChannels(categories);
  } catch (error) {
    console.error(`Failed to get discussions categories for ${communitySlug}:`, error);
    throw error;
  }
}

export async function getDiscussionChannel(communitySlug: string, channelSlug: string): Promise<ChannelOverview | null> {
  try {
    const community = await prisma.community.findUnique({
      where: { slug: communitySlug },
      select: { id: true },
    });

    if (!community) {
      return null;
    }

    const channel = await prisma.discussionChannel.findFirst({
      where: {
        slug: channelSlug,
        communityId: community.id,
      },
    });

    if (!channel) {
      return null;
    }

    return serializeChannelOverview(channel);
  } catch (error) {
    console.error(`Failed to get discussion channel ${channelSlug} for ${communitySlug}:`, error);
    throw error;
  }
}

export async function getChannelPosts(
  channelId: string,
  limit: number = 10,
  skip: number = 0
): Promise<ChannelPost[]> {
  try {
    const posts = await prisma.post.findMany({
      where: { channelId },
      orderBy: { createdAt: "desc" },
      take: limit,
      skip: skip,
      include: {
        author: {
          select: { id: true, name: true, image: true }
        },
        comments: {
          orderBy: { createdAt: "asc" },
          include: {
            author: {
              select: { id: true, name: true, image: true }
            }
          }
        },
        _count: {
          select: {
            comments: true,
            likes: true,
          }
        }
      }
    });

    return posts.map(serializeChannelPost);
  } catch (error) {
    console.error(`Failed to get channel posts for ${channelId}:`, error);
    throw error;
  }
}

export async function getTrendingChannels(communitySlug: string, limit: number = 4): Promise<(ChannelOverview & { postsCount: number })[]> {
  try {
    const community = await prisma.community.findUnique({
      where: { slug: communitySlug },
      select: { id: true },
    });

    if (!community) {
      return [];
    }

    const channels = await prisma.discussionChannel.findMany({
      where: { communityId: community.id },
      take: limit,
      include: {
        _count: {
          select: { posts: true }
        }
      },
    });

    const formatted = channels.map((chan) => ({
      id: chan.id,
      name: chan.name,
      slug: chan.slug,
      description: chan.description,
      categoryId: chan.categoryId,
      communityId: chan.communityId,
      postsCount: chan._count?.posts || 0,
    })).sort((a, b) => b.postsCount - a.postsCount);

    return formatted;
  } catch (error) {
    console.error(`Failed to get trending channels for ${communitySlug}:`, error);
    throw error;
  }
}
