import { z } from "zod";

export const createChannelSchema = z.object({
  name: z.string().min(1, "Channel name is required").max(30, "Name must be 30 characters or less"),
  slug: z.string().min(1, "Slug is required").regex(/^[a-z0-9-]+$/, "Slug must only contain lowercase letters, numbers, and hyphens"),
  description: z.string().max(100, "Description must be 100 characters or less").optional().nullable(),
  categoryId: z.string().min(1, "Category ID is required"),
});

export const createDiscussionPostSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(120, "Title must be 120 characters or less")
    .trim(),
  content: z
    .string()
    .min(10, "Content must be at least 10 characters")
    .max(20000, "Content must be 20,000 characters or less")
    .trim(),
  channelId: z.string().min(1, "Please select a channel"),
  tags: z
    .array(
      z
        .string()
        .min(1, "Tag cannot be empty")
        .max(24, "Each tag must be 24 characters or less")
        .regex(/^[a-zA-Z0-9_-]+$/, "Tags may only contain letters, numbers, hyphens, and underscores")
    )
    .max(5, "You can add up to 5 tags")
    .optional()
    .default([]),
});

export type CreateDiscussionPostInput = z.infer<typeof createDiscussionPostSchema>;
