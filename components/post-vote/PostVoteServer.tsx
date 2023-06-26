import {Post, Vote, VoteType} from "@prisma/client";
import {getAuthSession} from "@/lib/auth";
import {notFound} from "next/navigation";
import PostVoteClient from "@/components/post-vote/PostVoteClient";

interface PostVoteServerProps {
  postId: string;
  initialVoteCount?: number;
  initialVote?: VoteType | null;
  getData?: () => Promise<(Post & { votes: Vote[] }) | null>;
}

const PostVoteServer = async ({ postId, initialVoteCount, initialVote, getData }: PostVoteServerProps) => {
  const session = await getAuthSession();

  let voteCount = 0;
  let currentVote: VoteType | null | undefined = undefined;

  if (getData) {
    const post = await getData();
    if (!post) {
      return notFound();
    }
    voteCount = post.votes.reduce((acc, vote) => {
      if (vote.type === 'UP') {
        return acc + 1;
      } else if (vote.type === 'DOWN') {
        return acc - 1;
      } else {
        return acc;
      }
    }, 0);

    currentVote = post.votes.find((vote) => vote.userId === session?.user?.id)?.type;
  } else {
    voteCount = initialVoteCount!;
    currentVote = initialVote;
  }

  return (
    <PostVoteClient
      postId={postId}
      initialVoteCount={voteCount}
      initialVote={currentVote}
    />
  );
};

export default PostVoteServer;