import prisma from "@/lib/prismadb";
import {notFound} from "next/navigation";
import Editor from "@/components/Editor";

export const metadata = {
  title: 'Moments - Create post',
  description: 'Sharing Stories, Shaping Community',
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://moments-connect.vercel.app',
    title: "Moments - Create post",
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
    title: "Moments - Create post",
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
    slug: string
  }
}

const Page = async ({params}: PageProps) => {
  const community = await prisma.community.findFirst({
    where: {
      name: params.slug,
    },
  });

  if (!community) {
    return notFound();
  }

  return (
    <div className="flex flex-col items-start gap-6">
      <div className="border-b border-gray-200 pb-5">
        <div className="-ml-2 -mt-2 flex flex-wrap items-baseline">
          <h3 className="ml-2 mt-2 text-base font-semibold leading-6 text-gray-900">
            Create post
          </h3>
          <p className="ml-2 mt-1 truncate text-sm text-gray-500">
            in c/{params.slug}
          </p>
        </div>
      </div>

      {/* form */}
      <Editor
        communityId={community.id}
      />
    </div>
  );
};

export default Page;