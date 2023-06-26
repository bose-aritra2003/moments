import prisma from "@/lib/prismadb";
import {notFound} from "next/navigation";
import {Suspense} from "react";
import PostVoteSkeleton from "@/components/loading/PostVoteSkeleton";
import PostVoteServer from "@/components/post-vote/PostVoteServer";
import {formatTimeToNow, nFormatter} from "@/lib/utils";
import EditorOutput from "@/components/EditorOutput";
import CommentsSection from "@/components/CommentsSection";
import CommentLoader from "@/components/loading/CommentLoader";
import {Badge} from "@/components/ui/Badge";
import PostDeleteBtn from "@/components/PostDeleteBtn";
import {getAuthSession} from "@/lib/auth";
import {BarChart2, MessagesSquare} from "lucide-react";

export const metadata = {
  title: 'Moments - Post',
  description: 'Sharing Stories, Shaping Community',
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://moments-community.vercel.app',
    title: "Moments - Post",
    siteName: 'Moments',
    description: "Sharing Stories, Shaping Community",
    images: [
      {
        url: '/logo.svg',
        width: 256,
        height: 256,
      }
    ],
  },
  twitter: {
    title: "Moments - Post",
    description: "Sharing Stories, Shaping Community",
    card: "summary_large_image",
    images: [
      {
        url: '/apple-icon.png',
        width: 256,
        height: 256,
      }
    ],
  }
}

interface PageProps {
  params: {
    id: string
  }
}

export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'
export const revalidate = 0;

const Page = async ({ params }: PageProps) => {
  const session = await getAuthSession();

  const post = await prisma.post.findFirst({
    where: {
      id: params.id,
    },
    include: {
      votes: true,
      author: true,
      comments: true,
    },
  });

  if (!post) {
    return notFound();
  }

  return (
    <div>
      <div className="w-full bg-white p-4 rounded-t-lg shadow">
        <p className="max-h-40 mt-1 truncate text-xs text-gray-500">
          Posted by u/{post.author.username}{' '}
          {
            formatTimeToNow(new Date(post.createdAt))
          }{' • '}
          {nFormatter(post.votes.length, 1)} vote{post.votes.length !== 1 && 's'}
        </p>
        <h1 className="flex gap-2 items-center text-xl font-semibold py-2 leading-6 text-gray-900">
          { post.title }
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

        <EditorOutput content={post.content} />

        <hr className="w-full h-px my-6"/>

        <Suspense fallback={<CommentLoader />}>
          {/*@ts-expect-error server component*/}
          <CommentsSection postId={post.id}/>
        </Suspense>
      </div>
      <div className="bg-gray-50 z-20 text-sm p-4 sm:px-6 rounded-b-lg flex shadow items-center justify-between">
        <div className="w-fit flex items-center gap-2">
          <MessagesSquare className="h-4 w-4"/> {nFormatter(post.comments.length, 1)}
          <p className="hidden md:block">comment{post.comments.length !== 1 && 's'}</p>

          <span className="text-xs text-gray-400">|</span>

          <BarChart2 className="h-4 w-4"/> {nFormatter(post.votes.length, 1)}
          <p className="hidden md:block">vote{post.votes.length !== 1 && 's'}</p>
        </div>
        <div className="flex items-center gap-2">
          <Suspense fallback={<PostVoteSkeleton />}>
            {/* @ts-expect-error server component */}
            <PostVoteServer
              postId={post.id}
              getData={async () => {
                return await prisma.post.findUnique({
                  where: {
                    id: params.id,
                  },
                  include: {
                    votes: true
                  },
                })
              }}
            />
          </Suspense>
          {
            session?.user?.id === post.authorId && <PostDeleteBtn id={post.id} />
          }
        </div>
      </div>
    </div>
  );
};

export default Page;
