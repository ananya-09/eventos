import { CommunityRepository } from '@/server/repositories/community.repository'
import type { CreateCommunityInput } from '@/server/validators/community.validator'

export class CommunityService {
  static async createCommunity(userId: string, data: CreateCommunityInput) {
    const existing = await CommunityRepository.findBySlug(data.slug)
    if (existing) {
      throw new Error('Community with this slug already exists')
    }

    return CommunityRepository.create(userId, data)
  }

  static async joinCommunity(userId: string, communityId: string) {
    const isMember = await CommunityRepository.isMember(userId, communityId)
    if (isMember) {
      throw new Error('Already a member of this community')
    }

    return CommunityRepository.addMember(userId, communityId)
  }

  static async getCommunityBySlug(slug: string) {
  const community =
    await CommunityRepository.findBySlug(slug)

  if (!community) {
    throw new Error('Community not found')
  }

  return community
}
}
