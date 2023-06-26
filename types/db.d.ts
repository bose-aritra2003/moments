import { Post, Comment, Community, User, Vote, CommentVote } from '@prisma/client'

export type ExtendedPost = Post & {
  community: Community,
  votes: Vote[],
  isNsfw?: boolean,
  author: User,
  comments: Comment[]
}

export type ExtendedComment = Comment & {
  votes: CommentVote[],
  author: User,
}