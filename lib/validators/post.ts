import { z } from "zod";

export const PostValidator = z.object({
  title: z
    .string()
    .min(3, { message: 'Title must be longer than 3 characters' })
    .max(128 , { message: 'Title can be at max 128 characters' }),

  communityId: z.string(),
  content: z.any(),
  isNsfw: z.boolean().default(false),
});

export type PostCreationSchema = z.infer<typeof PostValidator>;