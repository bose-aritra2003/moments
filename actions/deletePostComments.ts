import deleteCommentReplies from "@/actions/deleteCommentReplies";

const deletePostComments = async (postId: string, prisma: any) => {
  const comments = await prisma.comment.findMany({
    where: {
      postId,
      replyToId: null,
    },
  });

  for (const comment of comments) {
    await deleteCommentReplies(comment.id, prisma);
  }
}
export default deletePostComments;