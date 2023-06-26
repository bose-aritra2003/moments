import {FC} from 'react';
import Image from "next/image";
import Link from "next/link";
import AuthForm from "@/components/AuthForm";

const SignUp: FC = () => {
  return (
    <div className="container mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px]">
      <div className="flex flex-col space-y-4 text-center">
        <Image
          width={64}
          height={64}
          src="/icon.svg"
          alt="logo"
          className="mx-auto h-12 w-12"
        />
        <h1 className="text-2xl font-semibold tracking-tight">
          Create new account
        </h1>
        <p className="text-sm max-w-xs mx-auto">
          By continuing, your are setting up a Moments account and agree to our User Agreement and Privacy Policy.
        </p>

        {/*sign in form*/}
        <AuthForm />

        <p className="px-8 text-center text-sm text-gray-700">
          Already have an account?{' '}
          <Link
            href={'/sign-in'}
            replace
            className="hover:text-gray-900 text-sm underline underline-offset-4"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;