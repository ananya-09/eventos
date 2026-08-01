import { prisma } from "@/lib/prisma";

import { CreatePostInput } from "../validators/post.validator";

export class PostService {
  static async createPost(
    userId: string,
    data: CreatePostInput
  ) {
    // 1. Find community
    const community = await prisma.community.findUnique({
      where: {
        slug: data.communitySlug,
      },
    });

    if (!community) {
      throw new Error("Community not found");
    }

    // 2. Check membership
    const membership = await prisma.communityMember.findUnique({
      where: {
        userId_communityId: {
          userId,
          communityId: community.id,
        },
      },
    });

    if (!membership) {
      throw new Error(
        "You must join the community before posting"
      );
    }

    // 3. Create post
    const post = await prisma.post.create({
      data: {
        title: data.title,
        content: data.content,
        authorId: userId,
        communityId: community.id,
      },

      include: {
        author: true,
        community: true,
      },
    });

    return post;
  }
}