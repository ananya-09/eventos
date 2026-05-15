import prisma from '@/server/db/prisma'
import type { CreatePostInput } from '@/server/validators/post.validator'

export class PostRepository {
  static async create(authorId: string, data: CreatePostInput) {
    return prisma.post.create({
      data: {
        ...data,
        authorId,
      },
    })
  }

  static async findById(id: string) {
    return prisma.post.findUnique({
      where: { id },
      include: {
        author: {
          select: { name: true, image: true },
        },
        community: {
          select: { name: true, slug: true },
        },
        _count: {
          select: { comments: true, likes: true },
        },
      },
    })
  }

  static async listByCommunity(communityId: string, limit = 10, offset = 0) {
    return prisma.post.findMany({
      where: { communityId },
      take: limit,
      skip: offset,
      orderBy: { createdAt: 'desc' },
      include: {
        author: {
          select: { name: true, image: true },
        },
      },
    })
  }
}
