import { z } from "zod";

export const createCommentSchema = z.object({
  content: z
    .string()
    .min(2, "Comment too short")
    .max(1000, "Comment too long"),
  parentId: z.string().optional().nullable(),
});

export type CreateCommentInput =
  z.infer<typeof createCommentSchema>;