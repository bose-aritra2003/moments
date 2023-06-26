'use client';

import {FC, useState} from 'react';
import {Button} from "@/components/ui/Button";
import {cn} from "@/lib/utils";
import {signIn} from "next-auth/react";
import toast from "react-hot-toast";
import {CgSpinner} from "react-icons/cg";
import {Icons} from '@/components/Icons'
import {Github} from "lucide-react";

interface AuthFormProps extends React.HTMLAttributes<HTMLDivElement> {
}

const AuthForm: FC<AuthFormProps> = ({className, ...props}) => {
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isGithubLoading, setIsGithubLoading] = useState(false);

  const loginWithGoogle = async () => {
    setIsGoogleLoading(true);
    try {
      await signIn('google');
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsGoogleLoading(false);
    }
  }

  const loginWithGithub = async () => {
    setIsGithubLoading(true);
    try {
      await signIn('github');
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsGithubLoading(false);
    }
  }

  return (
    <div
      className={cn(
        'flex justify-center gap-1 items-center',
        className)}
      {...props}
    >
      <Button
        disabled={isGithubLoading}
        onClick={loginWithGithub}
        size='sm'
        className="bg-black hover:bg-black hover:opacity-80 w-full rounded-md transition-all"
      >
        {
          isGithubLoading ?
            <CgSpinner className="h-4 w-4 mr-2 animate-spin"/> :
            <Github className="h-4 w-4 mr-2"/>
        }
        Github
      </Button>
      <Button
        disabled={isGoogleLoading}
        onClick={loginWithGoogle}
        size='sm'
        className="bg-black hover:bg-black hover:opacity-80 w-full rounded-md transition-all"
      >
        {
          isGoogleLoading ?
            <CgSpinner className="h-4 w-4 mr-2 animate-spin"/> :
            <Icons.Google className="h-4 w-4 mr-2"/>
        }
        Google
      </Button>
    </div>
  );
};

export default AuthForm;