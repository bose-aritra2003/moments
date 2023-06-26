'use client';

import {FC, useState} from 'react';
import {User} from "next-auth";
import {
  DropdownMenu,
  DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/DropdownMenu";
import UserAvatar from "@/components/UserAvatar";
import Link from "next/link";
import {signOut} from "next-auth/react";
import {Menu} from "lucide-react";
import {useRouter} from "next/navigation";

interface UserAccountNavProps {
  user: Pick<User, 'name' | 'image' | 'email'> | null;
}

const UserAccountNav: FC<UserAccountNavProps> = ({ user }) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleSignOut = async (e: Event) => {
    e.preventDefault();
    await signOut({
      callbackUrl: `${window.location.origin}/sign-in`,
    })
  }

  const handleSignIn = (e: Event) => {
    e.preventDefault();
    setIsOpen(false);
    router.push('/sign-in');
  }

  return (
    <DropdownMenu
      open={isOpen}
      onOpenChange={toggleDropdown}
    >
      <DropdownMenuTrigger className="focus:outline-none">
        {
          user ? (
            <UserAvatar
              className="h-10 w-10"
              user={{
                name: user?.name || null,
                image: user?.image || null,
              }}
            />
          ) : (
            <Menu className="h-9 w-9 p-1 rounded-md hover:bg-gray-200 transition-colors text-emerald-900" />
          )
        }
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-white" align="end">
        <div className="flex items-center justify-start gap-2 p-2">
          <div className="flex flex-col space-y-1 leading-none">
            <p className="font-medium truncate">
              { user?.name ? user.name : 'Welcome' }
            </p>
            <p className="w-[200px] truncate text-sm text-gray-700">
              { user?.email ? user.email : 'Build your community' }
            </p>
          </div>
        </div>

        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <Link href={'/explore'}>Explore</Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link href={'/c/create'}>Create community</Link>
        </DropdownMenuItem>

        {
          user && (
            <DropdownMenuItem asChild>
              <Link href={'/settings'}>Settings</Link>
            </DropdownMenuItem>
          )
        }

        <DropdownMenuSeparator />

        {
          user ? (
            <DropdownMenuItem onSelect={handleSignOut} className="cursor-pointer">
              Sign out
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem onSelect={handleSignIn} className="cursor-pointer">
              Sign in
            </DropdownMenuItem>
          )
        }
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserAccountNav;