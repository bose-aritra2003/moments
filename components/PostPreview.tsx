'use client';

import {FC, useRef} from 'react';
import {Post, User, Vote} from "@prisma/client";
import {formatTimeToNow, nFormatter} from "@/lib/utils";
import EditorOutput from "@/components/EditorOutput";
import PostVoteClient from "@/components/post-vote/PostVoteClient";
import Link from "next/link";
import {BarChart2, MessagesSquare} from "lucide-react";
import {Badge} from "@/components/ui/Badge";
import PostDeleteBtn from "@/components/PostDeleteBtn";
import {useSession} from "next-auth/react";

type PartialVote = Pick<Vote, 'type'>;

interface PostPreviewProps {
  communityName: string;
  post: Post & {
    author: User;
    votes: Vote[];
  };
  commentCount: number;
  voteCount: number;
  currentVote?: PartialVote;
}

const PostPreview: FC<PostPreviewProps> = ({ communityName, post, commentCount, voteCount, currentVote }) => {
  const postRef = useRef<HTMLDivElement>(null);
  const {data: session} = useSession();

  return (
    <div className="rounded-lg bg-white shadow">
      <div className="p-4 flex justify-between">
        <div className="w-0 flex-1">
          <div className="max-h-40 mt-1 text-xs text-gray-500">
            {
              communityName && (
                <>
                  <Link
                    href={`/c/${communityName}`}
                    className="underline underline-offset-2 text-gray-900 transition-colors text-sm"
                  >
                    c/{communityName}
                  </Link>
                  <span className="px-1">•</span>
                </>
              )
            }
            <span>Posted by u/{post.author.username}</span>
            {' '}
            {
              formatTimeToNow(new Date(post.createdAt))
            }
          </div>

          <Link href={`/c/${communityName}/post/${post.id}`}>
            <h1 className="text-2xl font-semibold py-2 leading-6 text-gray-900 flex flex-wrap gap-2 items-center">
              {post.title}
              {
                post.isNsfw && (
                  <Badge
                    variant="outline"
                    className="text-[0.6rem] px-1 py-0 border border-rose-600 text-rose-600"
                  >
                    NSFW
                  </Badge>
                )
              }
            </h1>
          </Link>

          <hr className="bg-gray-500 h-px mb-4"/>

          <div
            ref={postRef}
            className="relative text-sm max-h-40 w-full overflow-clip"
          >
            <EditorOutput content={post.content} />
            {
              //If the height of post content exceeds a certain height we want fade the remaining to let the user know that there's more
              postRef.current?.clientHeight === 160 && (
                <div className="absolute bottom-0 left-0 h-24 w-full bg-gradient-to-t from-white to-transparent" />
              )
            }
          </div>
        </div>
      </div>

      <div className="bg-gray-50 z-20 text-sm p-4 sm:px-6 rounded-b-lg flex items-center justify-between">
        <Link
          href={`/c/${communityName}/post/${post.id}`}
          className="w-fit flex items-center gap-2"
        >
          <MessagesSquare className="h-4 w-4"/> {nFormatter(commentCount, 1)}
          <p className="hidden md:block">comment{commentCount !== 1 && 's'}</p>

          <span className="text-xs text-gray-400">|</span>

          <BarChart2 className="h-4 w-4"/> {nFormatter(post.votes.length, 1)}
          <p className="hidden md:block">vote{post.votes.length !== 1 && 's'}</p>
        </Link>
        <div className="flex items-center gap-2">
          <PostVoteClient postId={post.id} initialVote={currentVote?.type} initialVoteCount={voteCount} />
          {
            session?.user?.id === post.authorId && <PostDeleteBtn id={post.id} />
          }
        </div>
      </div>
    </div>
  );
};

export default PostPreview;