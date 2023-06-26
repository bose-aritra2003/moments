import {FC, useState} from 'react';
import {VoteType} from "@prisma/client";
import {usePrevious} from "@mantine/hooks";
import {useRouter} from "next/navigation";
import {useMutation} from "@tanstack/react-query";
import {CommentVoteSchema} from "@/lib/validators/vote";
import axios, {AxiosError} from "axios";
import toast from "react-hot-toast";
import {Button} from "@/components/ui/Button";
import {cn, nFormatter} from "@/lib/utils";
import {ThumbsDown, ThumbsUp} from "lucide-react";

interface CommentVoteClientProps {
  commentId: string;
  initialVoteCount: number;
  initialVote?: VoteType | null;
}

const CommentVoteClient: FC<CommentVoteClientProps> = ({ commentId, initialVoteCount, initialVote }) => {
  const [voteCount, setVoteCount] = useState(initialVoteCount);
  const [currentVote, setCurrentVote] = useState(initialVote);
  const prevVote = usePrevious(currentVote);
  const router = useRouter();

  const { mutate: vote, isLoading } = useMutation({
    mutationFn: async (voteType: VoteType) => {
      const payload: CommentVoteSchema  = {
        commentId,
        voteType,
      }
      await axios.patch('/api/community/post/comment/vote', payload);
    },
    onError: (err, voteType) => {
      if (voteType === 'UP') {
        setVoteCount((prev) => prev - 1);
      } else {
        setVoteCount((prev) => prev + 1);
      }

      //reset current vote
      setCurrentVote(prevVote);

      if (err instanceof AxiosError) {
        if (err.response?.status === 401) {
          toast.error('You must be signed in');
          return router.push('/sign-in');
        }
      }
      return toast.error('Something went wrong, please try again');
    },
    onMutate: (type: VoteType) => {
      if (currentVote === type) {
        setCurrentVote(undefined)
        if (type === 'UP') {
          setVoteCount((prev) => prev - 1);
        } else if (type === 'DOWN') {
          setVoteCount((prev) => prev + 1);
        }
      } else {
        setCurrentVote(type);
        if (type === 'UP') {
          setVoteCount((prev) => prev + (currentVote ? 2 : 1));
        } else if (type === 'DOWN') {
          setVoteCount((prev) => prev - (currentVote ? 2 : 1));
        }
      }
    },
  });

  return (
    <div className="flex gap-1">
      <Button
        size="icon"
        variant="ghost"
        aria-label="upvote"
        disabled={isLoading}
        onClick={() => vote('UP')}
      >
        <ThumbsUp
          className={cn(
            "h-4 w-4",
            {'text-emerald-500 fill-emerald-500': currentVote === 'UP'}
          )}
        />
      </Button>

      <p className="text-center py-2 font-medium text-sm text-gray-900">
        { nFormatter(voteCount, 1) }
      </p>

      <Button
        size="icon"
        variant="ghost"
        aria-label="downvote"
        disabled={isLoading}
        onClick={() => vote('DOWN')}
      >
        <ThumbsDown
          className={cn(
            "h-4 w-4",
            {'text-rose-500 fill-rose-500': currentVote === 'DOWN'}
          )}
        />
      </Button>
    </div>
  );
};

export default CommentVoteClient;