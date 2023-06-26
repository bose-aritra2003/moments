import {ReactNode} from "react";
import {getAuthSession} from "@/lib/auth";
import prisma from "@/lib/prismadb";
import {notFound} from "next/navigation";
import {format} from "date-fns";
import SubscribeLeaveToggle from "@/components/SubscribeLeaveToggle";
import Link from "next/link";
import {buttonVariants} from "@/components/ui/Button";
import BackButton from "@/components/BackButton";
import {nFormatter} from "@/lib/utils";
import {Cake, Smile, Text, Users2} from "lucide-react";
import CommunityDeleteBtn from "@/components/CommunityDeleteBtn";
import {Badge} from "@/components/ui/Badge";

export const metadata = {
  title: 'Moments - Community',
  description: 'Sharing Stories, Shaping Community',
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://moments-community.vercel.app',
    title: "Moments - Community",
    siteName: 'Moments',
    description: "Sharing Stories, Shaping Community",
    images: [
      {
        url: '/icon.svg',
        width: 256,
        height: 256,
      }
    ],
  },
  twitter: {
    title: "Moments - Community",
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

interface LayoutProps {
  children: ReactNode,
  params: {
    slug: string
  }
}

const Layout = async ({ children, params: { slug } }: LayoutProps) => {
  const session = await getAuthSession();

  const community = await prisma.community.findFirst({
    where: {
      name: slug
    },
    include: {
      creator: true,
      posts: {
        include: {
          author: true,
          votes: true,
        },
      },
    },
  });

  const subscription = !session?.user ? undefined :
    await prisma.subscription.findFirst({
      where: {
        community: {
          name: slug,
        },
        user: {
          id: session.user.id,
        },
      },
    });

  const isSubscribed = !!subscription;

  if (!community) {
    return notFound();
  }

  const memberCount = await prisma.subscription.count({
    where: {
      community: {
        name: slug,
      },
    },
  });

  return (
    <div className="mx-auto h-full py-6 md:py-12">
      <BackButton />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-y-4 md:gap-x-4 py-6">
        <div className="flex flex-col col-span-2 space-y-6">
          { children }
        </div>

        {/*info sidebar*/}
        <div className="block overflow-hidden h-fit rounded-lg border border-gray-200 order-first md:order-last">
          <div className="flex items-center justify-between px-6 py-4">
            <p className="font-semibold py-3 flex gap-2 items-center">
              About c/{community.name}
              {
                community.isNsfw && (
                  <Badge
                    variant="outline"
                    className="text-[0.5rem] px-1 border border-rose-600 text-rose-600"
                  >
                    NSFW
                  </Badge>
                )
              }
            </p>
            {
              session?.user?.id === community.creatorId && <CommunityDeleteBtn name={community.name} />
            }
          </div>

          <dl className="divide-y divide-gray-100 px-6 py-4 text-sm leading-6 bg-white">
            <div className="flex justify-between gap-x-4 py-3">
              <dt className="text-gray-500 flex gap-2 items-center">
                <Cake className="h-4 w-4"/>
                Created
              </dt>
              <dd className="text-gray-700">
                <time className="truncate" dateTime={community.createdAt.toDateString()}>
                  {
                    format(community.createdAt, 'MMMM d, yyyy')
                  }
                </time>
              </dd>
            </div>

            <div className="flex justify-between gap-x-4 py-3">
              <dt className="text-gray-500 flex gap-2 items-center">
                <Smile className="h-4 w-4" />
                By
              </dt>
              <dd className="text-gray-700">
                <div>
                  <div className="text-gray-900 truncate">
                    u/{ community.creator.username }
                  </div>
                </div>
              </dd>
            </div>

            <div className="flex justify-between gap-x-4 py-3">
              <dt className="text-gray-500 flex gap-2 items-center">
                <Users2 className="h-4 w-4" />
                Subscribers
              </dt>
              <dd className="text-gray-700">
                <div>
                  <div className="text-gray-900 truncate">
                    { nFormatter(memberCount, 1) }
                  </div>
                </div>
              </dd>
            </div>

            <div className="flex justify-between gap-x-4 py-3">
              <dt className="text-gray-500 flex gap-2 items-center">
                <Text className="h-4 w-4" />
                Posts
              </dt>
              <dd className="text-gray-700">
                <div>
                  <div className="text-gray-900 truncate">
                    { nFormatter(community.posts.length, 1) }
                  </div>
                </div>
              </dd>
            </div>

            {
              community.creatorId === session?.user.id && (
                <div className="flex justify-between gap-x-4 py-3">
                  <p className="text-gray-500">
                    You created this community
                  </p>
                </div>
              )
            }

            {
              community.creatorId !== session?.user.id && (
                <SubscribeLeaveToggle
                  communityId={community.id}
                  communityName={community.name}
                  isSubscribed={isSubscribed}
                />
              )
            }

            {
              isSubscribed && (
                <Link
                  href={`c/${slug}/submit`}
                  className={buttonVariants({
                    variant: 'outline',
                    className: 'w-full mb-6',
                  })}
                >
                  Create post
                </Link>
              )
            }
          </dl>
        </div>
      </div>
    </div>
  )
}
export default Layout