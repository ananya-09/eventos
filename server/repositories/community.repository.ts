import { prisma } from '@/lib/prisma'
import { CommunityRole } from '@prisma/client'
import type { CreateCommunityInput } from '@/server/validators/community.validator'

export class CommunityRepository {
  static async create(creatorId: string, data: CreateCommunityInput) {
    return prisma.$transaction(async (tx) => {
      const community = await tx.community.create({
        data: {
          ...data,
          creatorId,
        },
      })

      // Creator automatically becomes an ADMIN member
      await tx.communityMember.create({
        data: {
          userId: creatorId,
          communityId: community.id,
          role: CommunityRole.ADMIN,
        },
      })

      return community
    })
  }

  static async findBySlug(slug: string) {
    return prisma.community.findUnique({
      where: { slug },
      include: {
        _count: {
          select: { members: true, posts: true },
        },
      },
    })
  }

  static async addMember(userId: string, communityId: string, role: CommunityRole = CommunityRole.MEMBER) {
    return prisma.communityMember.create({
      data: {
        userId,
        communityId,
        role,
      },
    })
  }

  static async isMember(userId: string, communityId: string) {
    const membership = await prisma.communityMember.findUnique({
      where: {
        userId_communityId: {
          userId,
          communityId,
        },
      },
    })
    return !!membership
  }
}
