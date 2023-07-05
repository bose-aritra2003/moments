'use client'

import {FC} from 'react';
import {usePathname, useRouter} from "next/navigation";
import {Session} from "next-auth";
import UserAvatar from "@/components/UserAvatar";
import {Input} from "@/components/ui/Input";
import {Button} from "@/components/ui/Button";
import {Camera, Link} from "lucide-react";

interface MiniCreatePostProps {
  session: Session | null
}

const MiniCreatePost: FC<MiniCreatePostProps> = ({ session }) => {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div className="overflow-hidden rounded-md bg-white shadow font-normal text-lg">
      <div className="h-full px-6 py-4 flex sm:justify-between gap-2 sm:gap-4">
        <div className="relative">
          <UserAvatar
            user={{
              name: session?.user.name || null,
              image: session?.user.image || null,
            }}
          />
          {
            session?.user && <span className="absolute bottom-0 right-0 rounded-full w-3 h-3 bg-blue-500 outline outline-2 outline-white" />
          }
        </div>
        <Input
          readOnly
          onClick={() => router.push(`${pathname}/submit`)}
          placeholder='Create post'
          className='cursor-text'
        />
        <div className="flex items-center gap-2">
          <Button
            onClick={() => router.push(`${pathname}/submit`)}
            variant='ghost'
            size="icon"
          >
            <Camera className="h-5 w-5 text-gray-600 hover:text-blue-700"/>
          </Button>
          <Button
            onClick={() => router.push(`${pathname}/submit`)}
            variant='ghost'
            size="icon"
          >
            <Link className="h-5 w-5 text-gray-600 hover:text-blue-700"/>
          </Button>
        </div>

      </div>
    </div>
  );
};

export default MiniCreatePost;