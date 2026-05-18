import { z } from "zod";

export const createPostSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(200, "Title is too long"),

  content: z
    .string()
    .min(10, "Content must be at least 10 characters"),

  communitySlug: z
    .string()
    .min(1, "Community slug is required"),
});

export type CreatePostInput = z.infer<typeof createPostSchema>;