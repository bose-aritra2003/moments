import {getAuthSession} from "@/lib/auth";
import prisma from "@/lib/prismadb";
import CommunityCard from "@/components/CommunityCard";

export const revalidate = 0;

const ExploreCommunities = async () => {
  const session = await getAuthSession();

  const communitiesToShow = await prisma.community.findMany({
    include: {
      creator: true,
      subscribers: true,
      posts: true,
    },
  });

  //Communities which the user is subscribed to should be shown last
  if (session?.user) {
    communitiesToShow.sort((a, b) => {
      if (a.subscribers.some((subscriber) => subscriber.userId === session.user.id)) {
        return 1;
      } else if (b.subscribers.some((subscriber) => subscriber.userId === session.user.id)) {
        return -1;
      } else {
        return 0;
      }
    });
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:md:grid-cols-4 gap-4 py-6">
      {
        communitiesToShow.map((community) => (
          <CommunityCard
            key={community.id}
            name={community.name}
            subscriberCount={community.subscribers.length}
            postCount={community.posts.length}
            isNsfw={community.isNsfw}
            creatorName={community.creator.username!}
            subscribed={
              session?.user && community.subscribers.some((subscriber) => subscriber.userId === session.user.id)
            }
          />
        ))
      }
    </div>
  );
}
export default ExploreCommunities;