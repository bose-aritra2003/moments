import prisma from "@/lib/prismadb";
import {INFINITE_SCROLL_RESULTS} from "@/config";
import PostFeed from "@/components/PostFeed";

const GeneralFeed = async () => {
  const posts = await prisma.post.findMany({
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      votes: true,
      author: true,
      comments: true,
      community: true,
    },
    take: INFINITE_SCROLL_RESULTS,
  });

  return <PostFeed initialPosts={posts} />;
};
export default GeneralFeed;