import { prisma } from "@/lib/prisma";
import { CommunityRole } from "@prisma/client";

/**
 * Community owner (creator) or ADMIN members may manage branding assets.
 */
export async function canManageCommunityBranding(
  userId: string,
  communityId: string
): Promise<boolean> {
  const community = await prisma.community.findUnique({
    where: { id: communityId },
    select: { creatorId: true },
  });

  if (!community) return false;
  if (community.creatorId === userId) return true;

  const membership = await prisma.communityMember.findUnique({
    where: {
      userId_communityId: { userId, communityId },
    },
    select: { role: true },
  });

  return membership?.role === CommunityRole.ADMIN;
}

export async function canManageCommunityBrandingBySlug(
  userId: string,
  slug: string
): Promise<{ allowed: boolean; communityId?: string }> {
  const community = await prisma.community.findUnique({
    where: { slug },
    select: { id: true },
  });

  if (!community) return { allowed: false };

  const allowed = await canManageCommunityBranding(userId, community.id);
  return { allowed, communityId: community.id };
}
