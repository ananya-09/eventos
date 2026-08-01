import { prisma } from "@/lib/prisma";
import { NotificationType } from "@prisma/client";
import { NotificationService } from "./notification.service";

export interface TrustLevelConfig {
  level: number;
  name: string;
  minReputation: number;
  capabilities: {
    postLinks: boolean;
    downvote: boolean;
    flagReview: boolean;
    lockThread: boolean;
  };
}

export const TRUST_LEVELS: TrustLevelConfig[] = [
  {
    level: 0,
    name: "Newcomer",
    minReputation: -Infinity,
    capabilities: { postLinks: false, downvote: false, flagReview: false, lockThread: false },
  },
  {
    level: 1,
    name: "Basic Member",
    minReputation: 10,
    capabilities: { postLinks: true, downvote: true, flagReview: false, lockThread: false },
  },
  {
    level: 2,
    name: "Trusted Contributor",
    minReputation: 100,
    capabilities: { postLinks: true, downvote: true, flagReview: true, lockThread: false },
  },
  {
    level: 3,
    name: "Moderator Candidate",
    minReputation: 500,
    capabilities: { postLinks: true, downvote: true, flagReview: true, lockThread: true },
  },
];

// Seed default badges in memory structure for checks
export const DEFAULT_BADGES = [
  {
    name: "First Spark",
    description: "Earned by gaining your first positive vote",
    icon: "Sparkles",
    type: "MILESTONE",
    condition: (rep: number, postCount: number, topCommentScore: number) => rep > 0,
  },
  {
    name: "Rising Star",
    description: "Earned by reaching 100 reputation points",
    icon: "TrendingUp",
    type: "MILESTONE",
    condition: (rep: number, postCount: number, topCommentScore: number) => rep >= 100,
  },
  {
    name: "Pillar of Community",
    description: "Earned by reaching 500 reputation points",
    icon: "ShieldCheck",
    type: "MILESTONE",
    condition: (rep: number, postCount: number, topCommentScore: number) => rep >= 500,
  },
  {
    name: "Insightful Voice",
    description: "Earned by writing a comment with a score of 10 or more",
    icon: "MessageSquareText",
    type: "MILESTONE",
    condition: (rep: number, postCount: number, topCommentScore: number) => topCommentScore >= 10,
  },
];

export class ReputationService {
  /**
   * Calculate Hacker News Hot decay score for a post
   * Formula: score / (ageInHours + 2)^1.8
   */
  static calculateHotScore(score: number, createdAt: Date): number {
    const ageInHours = (Date.now() - createdAt.getTime()) / (1000 * 60 * 60);
    const gravity = 1.8;
    return score / Math.pow(ageInHours + 2, gravity);
  }

  /**
   * Get User Trust Level details based on current reputation
   */
  static getTrustLevel(reputation: number): TrustLevelConfig {
    let activeLevel = TRUST_LEVELS[0];
    for (const level of TRUST_LEVELS) {
      if (reputation >= level.minReputation) {
        activeLevel = level;
      }
    }
    return activeLevel;
  }

  /**
   * Check if a user is allowed to perform a gated action
   */
  static async canPerformAction(
    userId: string,
    action: keyof TrustLevelConfig["capabilities"]
  ): Promise<boolean> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { reputation: true },
    });
    if (!user) return false;

    const level = this.getTrustLevel(user.reputation);
    return level.capabilities[action];
  }

  /**
   * Upvote or Downvote a Post with vote aggregation, anti-spam, and reputation updates
   */
  static async voteOnPost(params: { userId: string; postId: string; value: 1 | -1 }) {
    const { userId, postId, value } = params;

    // Fetch post details to determine reputation changes
    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: { authorId: true, createdAt: true },
    });

    if (!post) throw new Error("Post not found");

    // Check if voter has the ability to downvote (Trust Level 1 required)
    if (value === -1) {
      const voter = await prisma.user.findUnique({
        where: { id: userId },
        select: { reputation: true },
      });
      if (voter && voter.reputation < 10) {
        throw new Error("You need at least 10 reputation to downvote content");
      }
    }

    // Retrieve existing vote if any
    const existingVote = await prisma.postVote.findUnique({
      where: {
        userId_postId: { userId, postId },
      },
    });

    let voteDiff = 0;
    let repDiff = 0;

    if (existingVote) {
      if (existingVote.value === value) {
        // Double-click same button => REMOVE vote
        voteDiff = -value;
        repDiff = value === 1 ? -10 : 2; // Removing upvote (-10), removing downvote (+2)
        await prisma.postVote.delete({
          where: { id: existingVote.id },
        });
      } else {
        // Toggle vote (e.g. upvote to downvote)
        voteDiff = 2 * value;
        repDiff = value === 1 ? 12 : -12; // Change downvote to upvote (+12), upvote to downvote (-12)
        await prisma.postVote.update({
          where: { id: existingVote.id },
          data: { value },
        });
      }
    } else {
      // New vote
      voteDiff = value;
      repDiff = value === 1 ? 10 : -2; // New upvote (+10), new downvote (-2)
      await prisma.postVote.create({
        data: { userId, postId, value },
      });
    }

    // Transactionally update Post Score, Hot Score and User Reputation
    const updatedPost = await prisma.$transaction(async (tx) => {
      // 1. Update Post Score
      const p = await tx.post.update({
        where: { id: postId },
        data: {
          score: { increment: voteDiff },
        },
        select: { score: true, createdAt: true },
      });

      // 2. Recalculate and update Hot Score
      const hotScore = this.calculateHotScore(p.score, p.createdAt);
      await tx.post.update({
        where: { id: postId },
        data: { hotScore },
      });

      // 3. Update Post Author's Reputation (if not voting on own post)
      if (post.authorId !== userId) {
        await tx.user.update({
          where: { id: post.authorId },
          data: { reputation: { increment: repDiff } },
        });

        // Trigger notification if it's a new upvote (and not self)
        if (!existingVote && value === 1) {
          await NotificationService.createNotification({
            userId: post.authorId,
            notifierId: userId,
            type: NotificationType.LIKE,
            entityType: "Post",
            entityId: postId,
            postId,
          });
        }
      }

      return p;
    });

    // Award badges to author asynchronously
    if (post.authorId !== userId) {
      this.checkAndAwardBadges(post.authorId).catch(console.error);
    }

    return {
      success: true,
      score: updatedPost.score,
      userVoted: existingVote && existingVote.value === value ? null : value,
    };
  }

  /**
   * Upvote or Downvote a Comment with vote aggregation, anti-spam, and reputation updates
   */
  static async voteOnComment(params: { userId: string; commentId: string; value: 1 | -1 }) {
    const { userId, commentId, value } = params;

    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
      select: { authorId: true, postId: true },
    });

    if (!comment) throw new Error("Comment not found");

    if (value === -1) {
      const voter = await prisma.user.findUnique({
        where: { id: userId },
        select: { reputation: true },
      });
      if (voter && voter.reputation < 10) {
        throw new Error("You need at least 10 reputation to downvote content");
      }
    }

    const existingVote = await prisma.commentVote.findUnique({
      where: {
        userId_commentId: { userId, commentId },
      },
    });

    let voteDiff = 0;
    let repDiff = 0;

    if (existingVote) {
      if (existingVote.value === value) {
        voteDiff = -value;
        repDiff = value === 1 ? -5 : 1;
        await prisma.commentVote.delete({
          where: { id: existingVote.id },
        });
      } else {
        voteDiff = 2 * value;
        repDiff = value === 1 ? 6 : -6;
        await prisma.commentVote.update({
          where: { id: existingVote.id },
          data: { value },
        });
      }
    } else {
      voteDiff = value;
      repDiff = value === 1 ? 5 : -1;
      await prisma.commentVote.create({
        data: { userId, commentId, value },
      });
    }

    const updatedComment = await prisma.$transaction(async (tx) => {
      const c = await tx.comment.update({
        where: { id: commentId },
        data: {
          score: { increment: voteDiff },
        },
        select: { score: true },
      });

      if (comment.authorId !== userId) {
        await tx.user.update({
          where: { id: comment.authorId },
          data: { reputation: { increment: repDiff } },
        });
      }

      return c;
    });

    if (comment.authorId !== userId) {
      this.checkAndAwardBadges(comment.authorId).catch(console.error);
    }

    return {
      success: true,
      score: updatedComment.score,
      userVoted: existingVote && existingVote.value === value ? null : value,
    };
  }

  /**
   * Check user statistics and award any badges they qualify for
   */
  static async checkAndAwardBadges(userId: string) {
    // 1. Fetch user data (reputation, posts count, top comment score)
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        badges: {
          select: { badgeId: true },
        },
      },
    });
    if (!user) return;

    const postCount = await prisma.post.count({
      where: { authorId: userId },
    });

    const topComment = await prisma.comment.findFirst({
      where: { authorId: userId },
      orderBy: { score: "desc" },
      select: { score: true },
    });
    const topCommentScore = topComment?.score || 0;

    const existingBadgeIds = new Set(user.badges.map((b) => b.badgeId));

    // 2. Verify qualifiers from DEFAULT_BADGES
    for (const badgeData of DEFAULT_BADGES) {
      const qualifies = badgeData.condition(user.reputation, postCount, topCommentScore);
      if (qualifies) {
        // Ensure badge exists in database
        let badge = await prisma.badge.findUnique({
          where: { name: badgeData.name },
        });

        if (!badge) {
          badge = await prisma.badge.create({
            data: {
              name: badgeData.name,
              description: badgeData.description,
              icon: badgeData.icon,
              type: badgeData.type,
            },
          });
        }

        if (!existingBadgeIds.has(badge.id)) {
          // Award badge transactionally to avoid race conditions
          await prisma.userBadge.upsert({
            where: {
              userId_badgeId: { userId, badgeId: badge.id },
            },
            create: { userId, badgeId: badge.id },
            update: {},
          });

          // Notify user of new achievement
          await NotificationService.createNotification({
            userId,
            type: NotificationType.ANNOUNCEMENT,
            entityType: "Badge",
            entityId: badge.id,
            metadata: {
              title: `Badge Unlocked: ${badge.name}`,
              bodySnippet: badge.description,
            },
          });
        }
      }
    }
  }
}
