import {getAuthSession} from "@/lib/auth";
import {redirect} from "next/navigation";
import UserNameForm from "@/components/UserNameForm";
import prisma from "@/lib/prismadb";
import PostPreview from "@/components/PostPreview";

export const metadata = {
  title: 'Moments - Settings',
  description: 'Profile settings for your Moments account',
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://moments-community.vercel.app/settings',
    title: "Moments - Settings",
    siteName: 'Moments',
    description: "Profile settings for your Moments account",
    images: [
      {
        url: '/icon.svg',
        width: 256,
        height: 256,
      }
    ],
  },
  twitter: {
    title: "Moments - Settings",
    description: "Profile settings for your Moments account",
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

const Page = async () => {
  const session = await getAuthSession();

  if (!session?.user) {
    redirect('/sign-in');
  }

  const userPosts = await prisma.post.findMany({
    where: {
      authorId: session.user.id
    },
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      votes: true,
      author: true,
      comments: true,
      community: true,
    },
  });

  return (
    <div className="max-w-4xl mx-auto py-12">
      <h1 className="gap-8 mb-4 font-bold text-3xl md:text-4xl">
        Settings
      </h1>
      <UserNameForm
        user={{
          id: session.user.id,
          username: session.user.username || '',
          image: session.user.image ?? null
        }}
      />
      {
        userPosts.length > 0 && (
          <h1 className="gap-8 pt-12 mb-4 font-bold text-3xl md:text-4xl">
            Your posts
          </h1>
        )
      }
      <ul className="flex flex-col col-span-2 space-y-6">
        {
          userPosts.map((userPost) => {
            const votesCount = userPost.votes.reduce((acc, vote) => {
              if (vote.type === 'UP') {
                return acc + 1;
              } else if(vote.type === 'DOWN') {
                return acc - 1;
              } else {
                return acc;
              }
            }, 0);

            const currentVote = userPost.votes.find((vote) => vote.userId === session?.user.id);

            return(
              <li key={userPost.id}>
                <PostPreview
                  post={userPost}
                  voteCount={votesCount}
                  currentVote={currentVote}
                  commentCount={userPost.comments.length}
                  communityName={userPost.community.name}
                />
              </li>
            );
          })
        }
      </ul>
    </div>
  );
};

export default Page;