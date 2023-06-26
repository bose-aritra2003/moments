import {FC, useState} from 'react';
import Image from "next/image";
import AuthForm from "@/components/AuthForm";

const SignIn: FC = () => {
  const [variant, setVariant] = useState<'signin' | 'signup'>('signin');

  const toggleVariant = () => {
    if (variant === 'signin') {
      setVariant('signup');
    } else {
      setVariant('signin');
    }
  }

  return (
    <div className="container mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px]">
      <div className="flex flex-col space-y-4 text-center">
        <Image
          width={64}
          height={64}
          src="/logo.svg"
          alt="logo"
          className="mx-auto h-12 w-12"
        />
        <h1 className="text-2xl font-semibold tracking-tight">
          {variant === 'signin' ? 'Welcome back' : 'Create new account'}
        </h1>
        <p className="text-sm max-w-xs mx-auto">
          {
            variant === 'signin' ?
              'Sign in to your Moments account to continue sharing stories and shaping your community.' :
              'By continuing, you are setting up a Moments account with your email in compliance with OAuth 2.0'
          }
        </p>

        {/* auth form */}
        <AuthForm />

        <p className="px-8 text-center text-sm text-gray-700">
          { variant === 'signin' ? 'New to Moments?' : 'Already have an account?' }
          {' '}
          <span
            onClick={() => toggleVariant()}
            className="hover:text-emerald-950 text-sm underline underline-offset-4 cursor-pointer transition-colors"
          >
            { variant === 'signin' ? 'Sign up' : 'Sign in' }
          </span>
        </p>
      </div>
    </div>
  );
};

export default SignIn;