import CreateCommunityForm from "@/components/CreateCommunityForm";
import {getAuthSession} from "@/lib/auth";
import {redirect} from "next/navigation";

export const metadata = {
  title: 'Moments - Create community',
  description: 'Create your own community on Moments',
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://moments-connect.vercel.app/create',
    title: "Moments - Create community",
    siteName: 'Moments',
    description: "Create your own community on Moments",
    images: [
      {
        url: '/icon.svg',
        width: 256,
        height: 256,
      }
    ],
  },
  twitter: {
    title: "Moments - Create community",
    description: "Create your own community on Moments",
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

  return (
    <div className="flex items-center h-full max-w-3xl mx-auto py-6 md:py-12">
      <div className="relative bg-white w-full h-fit p-4 rounded-lg space-y-6 shadow-md">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-semibold">
            Create a community
          </h1>
        </div>

        <hr className="bg-gray-500 h-px"/>

        <CreateCommunityForm />
      </div>
    </div>
  );
};

export default Page;