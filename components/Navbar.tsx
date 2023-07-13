import Link from "next/link";
import Image from "next/image";
import {getAuthSession} from "@/lib/auth";
import UserAccountNav from "@/components/UserAccountNav";
import SearchBox from "@/components/SearchBox";

const Navbar = async () => {
  const session = await getAuthSession();

  return (
    <div className="sticky top-0 inset-x-0 bg-gray-100/60 backdrop-blur-md shadow-md z-10 py-4">
      <div className="container max-w-7xl h-full mx-auto flex items-center justify-between gap-2">

        <Link
          href='/'
          className="flex gap-2 items-center"
        >
          <Image
            width={64}
            height={64}
            src="/icon.svg"
            alt="logo"
            className="h-10 w-10"
          />
          <p className="text-blue-950 text-2xl font-bold md:block">
            Moments
          </p>
        </Link>

        <div className="flex gap-4 md:gap-6 items-center">
          <div className="gap-6 hidden md:flex text-gray-600 font-medium text-lg">
            <Link
              className="hover:text-blue-950 transition-colors"
              href={'/'}
            >
              Home
            </Link>
            <Link
              className="hover:text-blue-950 transition-colors"
              href={'/explore'}
            >
              Explore
            </Link>
            {
              session?.user ? (
                <Link
                  className="hover:text-blue-950 transition-colors"
                  href={'/settings'}
                >
                  Settings
                </Link>
              ) : (
                <Link
                  className="hover:text-blue-950 transition-colors"
                  href={'/sign-in'}
                >
                  Sign in
                </Link>
              )
            }
          </div>
          <SearchBox />
          <UserAccountNav user={session?.user ?? null} />
        </div>

      </div>
    </div>
  );
}
export default Navbar;