'use client'

import {FC, useEffect, useRef} from 'react';
import {ExtendedPost} from "@/types/db";
import {useIntersection} from "@mantine/hooks";
import {useInfiniteQuery} from "@tanstack/react-query";
import {INFINITE_SCROLL_RESULTS} from "@/config";
import axios from "axios";
import {useSession} from "next-auth/react";
import PostPreview from "@/components/PostPreview";
import InfiniteScrollLoader from "@/components/loading/InfiniteScrollLoader";

interface PostFeedProps {
  initialPosts: ExtendedPost[];
  communityName?: string;
}

export const revalidate = 0;

const PostFeed: FC<PostFeedProps> = ({initialPosts, communityName}) => {
  const lastPostRef = useRef<HTMLElement>(null);
  const { ref, entry } = useIntersection({
    root: lastPostRef.current,
    threshold: 1
  });

  const { data: session } = useSession();

  const { data, fetchNextPage, isFetchingNextPage, hasNextPage } = useInfiniteQuery(
    ['infinite-query'],
    async ({ pageParam = 1 }) => {
      const query = `/api/posts?limit=${INFINITE_SCROLL_RESULTS}&page=${pageParam}` +
        (!!communityName ? `&communityName=${communityName}` : '');

      const { data } = await axios.get(query);
      return data as ExtendedPost[];
    }, {
      getNextPageParam: (_, pages) => {
        return pages.length + 1;
      },
      initialData: {
        pages: [initialPosts],
        pageParams: [1]
      },
    }
  );

  useEffect(() => {
    if (entry?.isIntersecting) {
      (async () => await fetchNextPage())();
    }
  }, [entry, fetchNextPage]);

  const posts = data?.pages.flatMap((page) => page) ?? initialPosts;

  return (
    <ul className="flex flex-col col-span-2 space-y-6">
      {
        posts.map((post, index) => {
          const votesCount = post.votes.reduce((acc, vote) => {
            if (vote.type === 'UP') {
              return acc + 1;
            } else if(vote.type === 'DOWN') {
              return acc - 1;
            } else {
              return acc;
            }
          }, 0);

          const currentVote = post.votes.find((vote) => vote.userId === session?.user.id);

          if (index === posts.length - 1) {
            return (
              <li key={post.id} ref={ref}>
                <PostPreview
                  post={post}
                  voteCount={votesCount}
                  currentVote={currentVote}
                  commentCount={post.comments.length}
                  communityName={post.community.name}
                />
              </li>
            );
          } else {
            return(
              <li key={post.id}>
                <PostPreview
                  post={post}
                  voteCount={votesCount}
                  currentVote={currentVote}
                  commentCount={post.comments.length}
                  communityName={post.community.name}
                />
              </li>
            );
          }
        })
      }
      {isFetchingNextPage && hasNextPage && (
        <li className='flex justify-center'>
          <InfiniteScrollLoader />
        </li>
      )}
    </ul>
  );
};

export default PostFeed;