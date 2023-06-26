import {getAuthSession} from "@/lib/auth";
import prisma from "@/lib/prismadb";
import PostComment from "@/components/PostComment";
import CreateComment from "@/components/CreateComment";

interface CommentsSectionProps {
  postId: string;
}

const CommentsSection = async ({postId}: CommentsSectionProps) => {
  const session = await getAuthSession();

  const comments = await prisma.comment.findMany({
    where: {
      postId,
      replyToId: null,
    },
    include: {
      author: true,
      votes: true,
      replies: {
        include: {
          author: true,
          votes: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  return (
    <div className="flex flex-col gap-y-4 mt-4 h-fit">
      <CreateComment postId={postId} />

      <div className="flex flex-col gap-y-6 mt-4">
        {
          comments
            .filter((comment) => !comment.replyToId)
            .map((mainComment) => {
              const mainCommentVoteCount = mainComment.votes.reduce((acc, vote) => {
                if (vote.type === 'UP') {
                  return acc + 1;
                } else if (vote.type === 'DOWN') {
                  return acc - 1;
                } else {
                  return acc;
                }
              }, 0);

              const mainCommentVote = mainComment.votes.find((vote) => vote.userId === session?.user.id);

              return (
                <div
                  key={mainComment.id}
                  className="flex flex-col"
                >
                  <div className="mb-2">
                    <PostComment
                      comment={mainComment}
                      postId={postId}
                      currentVote={mainCommentVote}
                      voteCount={mainCommentVoteCount}
                    />
                  </div>

                  {/*render replies*/}
                  {
                    //We sort in order of most voted
                    mainComment.replies
                      .sort((a, b) => b.votes.length - a.votes.length)
                      .map((reply) => {
                        const replyVoteCount = reply.votes.reduce((acc, vote) => {
                          if (vote.type === 'UP') {
                            return acc + 1;
                          } else if (vote.type === 'DOWN') {
                            return acc - 1;
                          } else {
                            return acc;
                          }
                        }, 0);

                        const replyVote = reply.votes.find((vote) => vote.userId === session?.user.id);
                        return (
                          <div
                            key={reply.id}
                            className="ml-2 px-4 py-2 border-l-2 border-gray-200"
                          >
                            <PostComment
                              comment={reply}
                              voteCount={replyVoteCount}
                              currentVote={replyVote}
                              postId={postId}
                            />
                          </div>
                        );
                      })
                  }
                </div>
              );
            })
        }
      </div>
    </div>
  );
};

export default CommentsSection;