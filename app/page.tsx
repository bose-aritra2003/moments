import Link from "next/link";
import {buttonVariants} from "@/components/ui/Button";
import GeneralFeed from "@/components/GeneralFeed";
import {Suspense} from "react";
import InfiniteScrollLoader from "@/components/loading/InfiniteScrollLoader";
import {Copyright, Github, HeartHandshake, Power, Wrench} from "lucide-react";

export const revalidate = 0;

const Home = () => {
  return (
    <div className="py-6 md:py-12">
      <h1 className="font-bold text-3xl md:text-4xl">
        Your feed
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-y-4 md:gap-x-4 py-6">
        <Suspense fallback={<InfiniteScrollLoader/>}>
          {/* @ts-expect-error server component */}
          <GeneralFeed />
        </Suspense>

        {/* info */}
        <div className="flex flex-col space-y-6 order-last">
          <div className="hidden md:block overflow-hidden h-fit rounded-lg border shadow border-gray-200">
            <div className="bg-emerald-100 px-6 py-4">
              <p className="font-semibold py-3 flex items-center gap-1.5 text-emerald-900">
                <HeartHandshake className="w-5 h-5"/>
                Start your own community
              </p>
            </div>
            <div className="-my-3 divide-y divide-gray-100 px-6 py-4 text-sm leading-6">
              <div className="flex justify-between gap-x-4 py-3">
                Join like-minded individuals, share ideas, and watch your community flourish.
              </div>

              <Link
                className={buttonVariants({
                  className: 'w-full mt-4 mb-6'
                })}
                href={'/c/create'}
              >
                Create community
              </Link>
            </div>
          </div>

          <div className="overflow-hidden h-fit rounded-lg border bg-white shadow border-gray-200 order-last">
            <dl className="divide-y divide-gray-100 px-4 py-2 text-sm leading-6">
              <div className="flex justify-between gap-x-3 py-3">
                <dt className="text-gray-500 flex gap-2 items-center truncate">
                  <Wrench className="h-4 w-4"/>
                  Developed by
                </dt>
                <dd className="text-gray-900 truncate">
                  <Link href='https://bose-aritra2003.github.io/my-portfolio-website/'>
                    Aritra Bose
                  </Link>
                </dd>
              </div>

              <div className="flex justify-between gap-x-3 py-3">
                <dt className="text-gray-500 flex gap-2 items-center truncate">
                  <Power className="h-4 w-4" />
                  Powered by
                </dt>
                <dd className="text-gray-900 truncate">
                  <Link href='https://nextjs.org'>
                    NextJS 13
                  </Link>
                </dd>
              </div>

              <div className="flex justify-between gap-x-3 py-3">
                <dt className="text-gray-500 flex gap-2 items-center truncate">
                  <Github className="h-4 w-4" />
                  View source
                </dt>
                <dd className="text-gray-900 truncate">
                  <Link href='#'>
                    Github
                  </Link>
                </dd>
              </div>

              <div className="flex justify-between gap-x-3 py-3">
                <dt className="text-gray-500 flex gap-2 items-center truncate">
                  <Copyright className="h-4 w-4" />
                  License
                </dt>
                <dd className="text-gray-900 truncate">
                  <Link href='#'>
                    2023 MIT
                  </Link>
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Home;