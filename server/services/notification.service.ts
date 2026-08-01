import { prisma } from "@/lib/prisma";
import { NotificationType, SubscriptionTarget, SubscriptionType } from "@prisma/client";

export class NotificationService {
  /**
   * Create a single notification with deduplication/batching for likes and thread activities
   */
  static async createNotification(params: {
    userId: string;
    notifierId?: string;
    type: NotificationType;
    entityType: string;
    entityId: string;
    postId?: string;
    commentId?: string;
    metadata?: any;
  }) {
    const { userId, notifierId, type, entityType, entityId, postId, commentId, metadata } = params;

    // Never notify the actor of their own actions
    if (notifierId && userId === notifierId) {
      return null;
    }

    // Check for watch/mute preferences
    if (postId) {
      const threadSub = await prisma.subscription.findUnique({
        where: {
          userId_targetType_targetId: {
            userId,
            targetType: SubscriptionTarget.THREAD,
            targetId: postId,
          },
        },
      });

      // If thread is muted, do not send notifications
      if (threadSub && threadSub.type === SubscriptionType.MUTE) {
        return null;
      }
    }

    // Deduplication & grouping for LIKE notifications
    if (type === NotificationType.LIKE) {
      const existingNotification = await prisma.notification.findFirst({
        where: {
          userId,
          type: NotificationType.LIKE,
          entityType,
          entityId,
          isRead: false,
        },
      });

      if (existingNotification) {
        const currentMeta = (existingNotification.metadata as any) || {};
        const count = (currentMeta.count || 1) + 1;
        
        return prisma.notification.update({
          where: { id: existingNotification.id },
          data: {
            notifierId: notifierId || null,
            metadata: {
              ...currentMeta,
              count,
            },
            isRead: false, // Make it unread again
            updatedAt: new Date(),
          },
        });
      }
    }

    // Standard notification creation
    return prisma.notification.create({
      data: {
        userId,
        notifierId: notifierId || null,
        type,
        entityType,
        entityId,
        postId: postId || null,
        commentId: commentId || null,
        metadata: metadata || null,
      },
    });
  }

  /**
   * Fetch a paginated list of notifications for a user
   */
  static async getNotifications(userId: string, limit = 10, cursor?: string) {
    const items = await prisma.notification.findMany({
      where: { userId },
      take: limit + 1,
      cursor: cursor ? { id: cursor } : undefined,
      skip: cursor ? 1 : 0,
      orderBy: { createdAt: "desc" },
      include: {
        notifier: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        post: {
          select: {
            id: true,
            title: true,
            community: {
              select: {
                slug: true,
              },
            },
          },
        },
      },
    });

    let nextCursor: string | null = null;
    if (items.length > limit) {
      const nextItem = items.pop();
      nextCursor = nextItem!.id;
    }

    return {
      notifications: items,
      nextCursor,
    };
  }

  /**
   * Get total unread notifications count (extremely fast index-covered scan)
   */
  static async getUnreadCount(userId: string): Promise<number> {
    return prisma.notification.count({
      where: {
        userId,
        isRead: false,
      },
    });
  }

  /**
   * Mark selected notifications as read
   */
  static async markAsRead(userId: string, notificationIds: string[]) {
    return prisma.notification.updateMany({
      where: {
        userId,
        id: { in: notificationIds },
      },
      data: {
        isRead: true,
      },
    });
  }

  /**
   * Mark all notifications of a user as read
   */
  static async markAllAsRead(userId: string) {
    return prisma.notification.updateMany({
      where: {
        userId,
        isRead: false,
      },
      data: {
        isRead: true,
      },
    });
  }

  /**
   * Find @username mentions, validate them, and trigger notifications
   */
  static async parseMentionsAndNotify(params: {
    content: string;
    postId: string;
    commentId?: string;
    authorId: string;
  }) {
    const { content, postId, commentId, authorId } = params;

    // Simple regex to parse usernames (e.g., @JaneDoe or @Jane_Doe)
    const mentionRegex = /@([a-zA-Z0-9_\-]+)/g;
    const matches = [...content.matchAll(mentionRegex)];
    if (matches.length === 0) return;

    const usernames = Array.from(new Set(matches.map((m) => m[1])));

    // Retrieve matching users
    const mentionedUsers = await prisma.user.findMany({
      where: {
        name: {
          in: usernames,
          mode: "insensitive",
        },
      },
      select: {
        id: true,
      },
    });

    // Create MENTION notifications for users
    const promises = mentionedUsers
      .filter((u) => u.id !== authorId) // Don't notify the author
      .map((u) =>
        NotificationService.createNotification({
          userId: u.id,
          notifierId: authorId,
          type: NotificationType.MENTION,
          entityType: commentId ? "Comment" : "Post",
          entityId: commentId || postId,
          postId,
          commentId,
          metadata: {
            bodySnippet: content.slice(0, 80) + (content.length > 80 ? "..." : ""),
          },
        })
      );

    await Promise.all(promises);
  }

  /**
   * Notify users subscribed to a thread when activity occurs
   */
  static async notifySubscribers(params: {
    postId: string;
    commentId: string;
    authorId: string;
    commentContent: string;
  }) {
    const { postId, commentId, authorId, commentContent } = params;

    // Retrieve the post to find the community context
    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: {
        authorId: true,
        communityId: true,
      },
    });

    if (!post) return;

    // Get all subscriptions related to the thread or the community
    const subscriptions = await prisma.subscription.findMany({
      where: {
        OR: [
          { targetType: SubscriptionTarget.THREAD, targetId: postId },
          { targetType: SubscriptionTarget.COMMUNITY, targetId: post.communityId },
        ],
      },
    });

    // Collate users to notify and those who have explicitly muted
    const notifyUserIds = new Set<string>();
    const mutedUserIds = new Set<string>();

    // Determine thread creator (automatically notified of replies unless muted)
    if (post.authorId !== authorId) {
      notifyUserIds.add(post.authorId);
    }

    subscriptions.forEach((sub) => {
      if (sub.type === SubscriptionType.MUTE) {
        mutedUserIds.add(sub.userId);
      } else if (sub.type === SubscriptionType.WATCH && sub.userId !== authorId) {
        notifyUserIds.add(sub.userId);
      }
    });

    // Filter out users who muted the thread or community
    const recipientIds = Array.from(notifyUserIds).filter((id) => !mutedUserIds.has(id));

    // Batch create notifications
    const promises = recipientIds.map((userId) => {
      const isPostOwner = userId === post.authorId;
      const type = isPostOwner ? NotificationType.REPLY : NotificationType.THREAD_ACTIVITY;

      return NotificationService.createNotification({
        userId,
        notifierId: authorId,
        type,
        entityType: "Comment",
        entityId: commentId,
        postId,
        commentId,
        metadata: {
          bodySnippet: commentContent.slice(0, 60) + (commentContent.length > 60 ? "..." : ""),
        },
      });
    });

    await Promise.all(promises);
  }

  /**
   * Log an activity to the activity feed
   */
  static async logActivity(params: {
    userId: string;
    communityId?: string;
    type: string;
    entityType: string;
    entityId: string;
  }) {
    const { userId, communityId, type, entityType, entityId } = params;

    return prisma.activity.create({
      data: {
        userId,
        communityId: communityId || null,
        type,
        entityType,
        entityId,
      },
    });
  }

  /**
   * Subscribe/Unsubscribe/Mute thread/community
   */
  static async setSubscription(params: {
    userId: string;
    targetType: SubscriptionTarget;
    targetId: string;
    type: SubscriptionType;
  }) {
    const { userId, targetType, targetId, type } = params;

    return prisma.subscription.upsert({
      where: {
        userId_targetType_targetId: {
          userId,
          targetType,
          targetId,
        },
      },
      update: { type },
      create: {
        userId,
        targetType,
        targetId,
        type,
      },
    });
  }

  /**
   * Delete subscription completely
   */
  static async removeSubscription(userId: string, targetType: SubscriptionTarget, targetId: string) {
    return prisma.subscription.delete({
      where: {
        userId_targetType_targetId: {
          userId,
          targetType,
          targetId,
        },
      },
    });
  }
}
