import { z } from 'zod'

export const createCommunitySchema = z.object({
  name: z.string().min(3).max(50),
  slug: z.string().min(3).max(50).regex(/^[a-z0-9-]+$/, {
    message: 'Slug must only contain lowercase letters, numbers, and hyphens',
  }),
  description: z.string().max(500).optional(),
  image: z.string().url().optional(),
  banner: z.string().url().optional(),
})

export type CreateCommunityInput = z.infer<typeof createCommunitySchema>

export const joinCommunitySchema = z.object({
  communityId: z.string().cuid(),
})
