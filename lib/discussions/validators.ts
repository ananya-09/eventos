import { z } from "zod";

export const createChannelSchema = z.object({
  name: z.string().min(1, "Channel name is required").max(30, "Name must be 30 characters or less"),
  slug: z.string().min(1, "Slug is required").regex(/^[a-z0-9-]+$/, "Slug must only contain lowercase letters, numbers, and hyphens"),
  description: z.string().max(100, "Description must be 100 characters or less").optional().nullable(),
  categoryId: z.string().min(1, "Category ID is required"),
});

export const createDiscussionPostSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(100, "Title must be 100 characters or less"),
  content: z.string().min(10, "Post content must be at least 10 characters"),
  channelId: z.string().min(1, "Channel ID is required"),
});
