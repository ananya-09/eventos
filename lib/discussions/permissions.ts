import { prisma } from "@/lib/prisma";

export async function canManageChannels(userId: string, communityId: string): Promise<boolean> {
  const member = await prisma.communityMember.findUnique({
    where: {
      userId_communityId: {
        userId,
        communityId,
      }
    },
    select: { role: true },
  });

  return !!member && (member.role === "ADMIN" || member.role === "MODERATOR");
}

export async function canPostInDiscussions(userId: string, communityId: string): Promise<boolean> {
  const member = await prisma.communityMember.findUnique({
    where: {
      userId_communityId: {
        userId,
        communityId,
      }
    },
    select: { id: true },
  });

  return !!member;
}
