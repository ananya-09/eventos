import { z } from 'zod'

export const createPostSchema = z.object({
  title: z.string().min(3).max(200),
  content: z.string().min(1),
  communityId: z.string().cuid(),
})

export type CreatePostInput = z.infer<typeof createPostSchema>
