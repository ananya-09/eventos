import { prisma } from "@/lib/prisma";
import { DashboardData } from "./types";
import { serializeDashboardPayload } from "./serializers";

export async function getCommunityDashboardData(slug: string): Promise<DashboardData | null> {
  try {
    // 1. Fetch community details along with count summaries
    const community = await prisma.community.findUnique({
      where: { slug },
      include: {
        creator: {
          select: { id: true, name: true, image: true }
        },
        _count: {
          select: {
            members: true,
            posts: true,
            events: true,
          }
        }
      }
    });

    if (!community) {
      return null;
    }

    // 2. Fetch upcoming events, discussions, organizers, and facepiles in parallel
    const now = new Date();
    const [upcomingEvents, recentPosts, organizers, activeMembers] = await Promise.all([
      prisma.event.findMany({
        where: {
          communityId: community.id,
          startDate: { gte: now },
        },
        orderBy: { startDate: "asc" },
        take: 4,
        include: {
          creator: {
            select: { id: true, name: true, image: true, email: true }
          }
        }
      }),
      prisma.post.findMany({
        where: { communityId: community.id },
        orderBy: { createdAt: "desc" },
        take: 5,
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
      }),
      prisma.communityMember.findMany({
        where: {
          communityId: community.id,
          role: { in: ["ADMIN", "MODERATOR"] },
        },
        orderBy: { joinedAt: "asc" },
        select: {
          role: true,
          joinedAt: true,
          user: {
            select: { id: true, name: true, image: true }
          }
        }
      }),
      prisma.communityMember.findMany({
        where: {
          communityId: community.id,
          role: "MEMBER",
        },
        orderBy: { joinedAt: "desc" },
        take: 6,
        select: {
          user: {
            select: { id: true, name: true, image: true }
          }
        }
      })
    ]);

    return serializeDashboardPayload(
      community,
      upcomingEvents,
      recentPosts,
      organizers,
      activeMembers
    );

  } catch (error) {
    console.error(`Failed to execute community dashboard data query for ${slug}:`, error);
    throw error;
  }
}
