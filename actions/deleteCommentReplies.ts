const deleteCommentReplies = async (commentId: string, prisma: any) => {
  const replies = await prisma.comment.findMany({
    where: {
      replyToId: commentId,
    },
  });

  for (const reply of replies) {
    await deleteCommentReplies(reply.id, prisma);
  }

  await prisma.comment.delete({
    where: {
      id: commentId,
    },
  });
}
export default deleteCommentReplies;
