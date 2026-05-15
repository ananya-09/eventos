import { PostRepository } from '@/server/repositories/post.repository'
import { CommunityRepository } from '@/server/repositories/community.repository'
import type { CreatePostInput } from '@/server/validators/post.validator'

export class PostService {
  static async createPost(userId: string, data: CreatePostInput) {
    const isMember = await CommunityRepository.isMember(userId, data.communityId)

    if (!isMember) {
      throw new Error('You must be a member of the community to post')
    }

    return PostRepository.create(userId, data)
  }
}
