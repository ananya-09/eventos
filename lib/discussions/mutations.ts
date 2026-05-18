import { prisma } from "@/lib/prisma";
import { canManageChannels, canPostInDiscussions } from "./permissions";
import { createChannelSchema, createDiscussionPostSchema } from "./validators";
import { ChannelOverview, ChannelPost } from "./types";
import { serializeChannelOverview, serializeChannelPost } from "./serializers";

export async function createDiscussionChannel(
  userId: string,
  communitySlug: string,
  rawPayload: any
): Promise<ChannelOverview> {
  try {
    const payload = createChannelSchema.parse(rawPayload);

    const community = await prisma.community.findUnique({
      where: { slug: communitySlug },
      select: { id: true },
    });

    if (!community) {
      throw new Error("Community not found");
    }

    const hasPermission = await canManageChannels(userId, community.id);
    if (!hasPermission) {
      throw new Error("Unauthorized: Only admins or moderators can create channels");
    }

    const category = await prisma.discussionCategory.findFirst({
      where: {
        id: payload.categoryId,
        communityId: community.id,
      },
    });

    if (!category) {
      throw new Error("Invalid category");
    }

    const existing = await prisma.discussionChannel.findFirst({
      where: {
        slug: payload.slug,
        communityId: community.id,
      },
    });

    if (existing) {
      throw new Error("A channel with this slug already exists");
    }

    const channel = await prisma.discussionChannel.create({
      data: {
        name: payload.name,
        slug: payload.slug,
        description: payload.description || null,
        categoryId: payload.categoryId,
        communityId: community.id,
      },
    });

    return serializeChannelOverview(channel);
  } catch (error) {
    console.error(`Failed to create discussion channel:`, error);
    throw error;
  }
}

export async function createDiscussionPost(
  userId: string,
  communitySlug: string,
  rawPayload: any
): Promise<ChannelPost> {
  try {
    const payload = createDiscussionPostSchema.parse(rawPayload);

    const community = await prisma.community.findUnique({
      where: { slug: communitySlug },
      select: { id: true },
    });

    if (!community) {
      throw new Error("Community not found");
    }

    const hasPermission = await canPostInDiscussions(userId, community.id);
    if (!hasPermission) {
      throw new Error("Unauthorized: You must be a member to post in discussions");
    }

    const channel = await prisma.discussionChannel.findFirst({
      where: {
        id: payload.channelId,
        communityId: community.id,
      },
    });

    if (!channel) {
      throw new Error("Invalid channel");
    }

    const post = await prisma.post.create({
      data: {
        title: payload.title,
        content: payload.content,
        authorId: userId,
        communityId: community.id,
        channelId: payload.channelId,
      },
      include: {
        author: {
          select: { id: true, name: true, image: true }
        },
        _count: {
          select: {
            comments: true,
            likes: true,
          }
        }
      }
    });

    return serializeChannelPost(post);
  } catch (error) {
    console.error(`Failed to create discussion post:`, error);
    throw error;
  }
}
