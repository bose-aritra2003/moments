import { z } from "zod";

export const CommunityValidator = z.object({
  name: z.string().min(3).max(21),
  isNsfw: z.boolean().default(false),
});

export const CommunitySubscriptionValidator = z.object({
  communityId: z.string(),
});

export type CreateCommunitySchema = z.infer<typeof CommunityValidator>;
export type SubscribeToCommunitySchema = z.infer<typeof CommunitySubscriptionValidator>;