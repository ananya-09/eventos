import { prisma } from "@/lib/prisma";

/** Sliding window — ready to wire to Redis / edge middleware later */
export const DISCUSSION_RATE_LIMIT = {
  windowMs: 60_000,
  maxPosts: 5,
} as const;

export async function checkDiscussionPostRateLimit(
  userId: string,
  communityId: string
): Promise<{ allowed: boolean; retryAfterMs?: number }> {
  const windowStart = new Date(Date.now() - DISCUSSION_RATE_LIMIT.windowMs);

  const recentCount = await prisma.post.count({
    where: {
      authorId: userId,
      communityId,
      channelId: { not: null },
      createdAt: { gte: windowStart },
    },
  });

  if (recentCount >= DISCUSSION_RATE_LIMIT.maxPosts) {
    const oldest = await prisma.post.findFirst({
      where: {
        authorId: userId,
        communityId,
        channelId: { not: null },
        createdAt: { gte: windowStart },
      },
      orderBy: { createdAt: "asc" },
      select: { createdAt: true },
    });

    const retryAfterMs = oldest
      ? Math.max(
          0,
          oldest.createdAt.getTime() +
            DISCUSSION_RATE_LIMIT.windowMs -
            Date.now()
        )
      : DISCUSSION_RATE_LIMIT.windowMs;

    return { allowed: false, retryAfterMs };
  }

  return { allowed: true };
}
