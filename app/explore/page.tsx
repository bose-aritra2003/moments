import ExploreCommunities from "@/components/ExploreCommunities";
import {Suspense} from "react";
import CommunitiesLoader from "@/components/loading/CommunitiesLoader";

export const metadata = {
  title: 'Moments - Explore',
  description: 'Explore communities to subscribe on Moments',
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://moments-connect.vercel.app/explore',
    title: "Moments - Explore",
    siteName: 'Moments',
    description: "Explore communities to subscribe on Moments",
    images: [
      {
        url: '/icon.svg',
        width: 256,
        height: 256,
      }
    ],
  },
  twitter: {
    title: "Moments - Explore",
    description: "Explore communities to subscribe on Moments",
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

const Page = () => {
  return (
    <div className="py-6 md:py-12">
      <h1 className="font-bold text-3xl md:text-4xl">
        Explore communities
      </h1>

      <Suspense fallback={<CommunitiesLoader/>}>
        {/* @ts-expect-error server component */}
        <ExploreCommunities />
      </Suspense>
    </div>
  );
};
export default Page;