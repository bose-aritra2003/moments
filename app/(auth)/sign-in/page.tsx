import SignIn from "@/components/SignIn";
import BackButton from "@/components/BackButton";

export const metadata = {
  title: 'Moments - Sign in',
  description: 'Sign in to your Moments account',
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://moments-connect.vercel.app/sign-in',
    title: "Moments - Sign in",
    siteName: 'Moments',
    description: "Sign in to your Moments account",
    images: [
      {
        url: '/icon.svg',
        width: 256,
        height: 256,
      }
    ],
  },
  twitter: {
    title: "Moments - Sign in",
    description: "Sign in to your Moments account",
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
    <div className="absolute inset-0">
      <div className="h-full max-w-2xl mx-auto flex flex-col items-center justify-center gap-20">

        <div className="hidden self-start -mt-20 md:block">
          <BackButton />
        </div>

        <SignIn/>
      </div>
    </div>
  );
};

export default Page;