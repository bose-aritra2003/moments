import {getAuthSession} from "@/lib/auth";
import prisma from "@/lib/prismadb";
import {INFINITE_SCROLL_RESULTS} from "@/config";
import {notFound} from "next/navigation";
import MiniCreatePost from "@/components/MiniCreatePost";
import PostFeed from "@/components/PostFeed";

interface PageProps {
  params: {
    slug: string
  }
}

export const revalidate = 0;

const Page = async ({ params }: PageProps) => {
  const { slug } = params;

  const session = await getAuthSession();

  const community = await prisma.community.findFirst({
    where: {
      name: slug
    },
    include: {
      posts: {
        include: {
          author: true,
          votes: true,
          comments: true,
          community: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: INFINITE_SCROLL_RESULTS,
      },
    },
  });

  if (!community) {
    return notFound();
  }
  return (
    <>
      <MiniCreatePost session={session} />
      <PostFeed
        initialPosts={community.posts}
        communityName={community.name}
      />
    </>
  );
};

export default Page;