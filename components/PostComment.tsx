'use client'

import {FC, useRef, useState} from 'react';
import UserAvatar from "@/components/UserAvatar";
import {ExtendedComment} from "@/types/db";
import {formatTimeToNow, nFormatter} from "@/lib/utils";
import CommentVoteClient from "@/components/CommentVoteClient";
import {CommentVote} from "@prisma/client";
import {Button} from "@/components/ui/Button";
import {useRouter} from "next/navigation";
import {useSession} from "next-auth/react";
import toast from "react-hot-toast";
import {Label} from "@/components/ui/Label";
import {Textarea} from "@/components/ui/Textarea";
import {useMutation} from "@tanstack/react-query";
import {CommentSchema} from "@/lib/validators/comment";
import axios from "axios";
import {Loader2, Reply} from "lucide-react";
import CommentDeleteBtn from "@/components/CommentDeleteBtn";

interface PostCommentProps {
  comment: ExtendedComment;
  voteCount: number;
  currentVote: CommentVote | undefined;
  postId: string;
}

const PostComment: FC<PostCommentProps> = ({ comment, voteCount, currentVote, postId }) => {
  const commentRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const {data: session} = useSession();
  const [isReplying, setIsReplying] = useState(false);
  const [input, setInput] = useState('');

  const {mutate: reply, isLoading} = useMutation({
    mutationFn: async ({postId, text, replyToId}: CommentSchema) => {
      const payload: CommentSchema = {
        postId,
        text,
        replyToId,
      }

      const { data } = await axios.patch('/api/community/post/comment', payload);
      return data;
    },
    onError: () => {
      return toast.error('Unable to post your reply, please try again');
    },
    onSuccess: () => {
      router.refresh();
      setInput('');
      setIsReplying(false);
      return toast.success('Your reply was posted successfully');
    }
  });

  const handleReply = (replyToId: String | null) => {
    if (!session) {
      toast.error('You must be signed in');
      return router.push('/sign-in');
    }
    setIsReplying(true);
    if(replyToId) {
      setInput(`u/${comment.author.username} `);
    }
  }

  return (
    <div
      ref={commentRef}
      className="flex flex-col"
    >
      <div
        className="flex items-center">
        <UserAvatar user={{
            name: comment.author.name || null,
            image: comment.author.image,
          }}
          className='h-7 w-7'
        />

        <div className="ml-2 flex items-center gap-x-2">
          <p className="text-sm font-medium text-gray-900 w-1/2 sm:w-fit truncate">
            u/{comment.author.username}
          </p>
          <time className="max-h-40 text-xs text-gray-500">
            {
              formatTimeToNow(new Date(comment.createdAt))
            }
          </time>
          <span className="text-xs text-gray-600">•</span>
          <p className="text-xs text-gray-500">
            {nFormatter(comment.votes.length, 1)} vote{comment.votes.length !== 1 && 's'}
          </p>
        </div>
      </div>

      <p className="text-sm text-gray-900 mt-2">
        { comment.text }
      </p>

      <div className="flex gap-2 items-center flex-wrap">
        <CommentVoteClient
          commentId={comment.id}
          initialVoteCount={voteCount}
          initialVote={currentVote?.type}
        />
        <Button
          variant='ghost'
          size='xs'
          className="text-xs text-gray-700"
          onClick={() => handleReply(comment.replyToId)}
        >
          <Reply className="h-4 w-4 mr-2"/>
          Reply
        </Button>
        {
          session?.user?.id === comment.authorId && <CommentDeleteBtn id={comment.id} />
        }
        {
          isReplying && (
            <div className="grid w-full gap-1.5">
              <Label htmlFor='comment'>
                Your reply
              </Label>
              <div className="mt-2">
                <Textarea
                  id='comment'
                  autoFocus
                  onFocus={(e) => e.currentTarget.setSelectionRange(e.currentTarget.value.length, e.currentTarget.value.length)}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder='What are your thoughts?'
                />
                <div className="mt-2 flex items-center justify-end gap-2">
                  <Button
                    tabIndex={-1}
                    variant='subtle'
                    disabled={isLoading}
                    onClick={() => setIsReplying(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    disabled={input.length === 0 || isLoading}
                    onClick={() => reply({ postId, text: input, replyToId: comment.replyToId ?? comment.id })}
                  >
                    {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin"/>}
                    Reply
                  </Button>
                </div>
              </div>
            </div>
          )
        }
      </div>
    </div>
  );
};

export default PostComment;