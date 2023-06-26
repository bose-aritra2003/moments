import { z } from 'zod'

export const PostVoteValidator = z.object({
  postId: z.string(),
  voteType: z.enum(['UP', 'DOWN']),
})

export type PostVoteSchema = z.infer<typeof PostVoteValidator>

export const CommentVoteValidator = z.object({
  commentId: z.string(),
  voteType: z.enum(['UP', 'DOWN']),
})

export type CommentVoteSchema = z.infer<typeof CommentVoteValidator>