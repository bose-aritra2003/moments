import { FC } from 'react';
import { User } from "next-auth";
import { Avatar, AvatarFallback } from "@/components/ui/Avatar";
import Image from "next/image";
import { AvatarProps } from "@radix-ui/react-avatar";
import {User2} from "lucide-react";

interface UserAvatarProps extends AvatarProps {
  user: Pick<User, 'name' | 'image'>
}

const UserAvatar: FC<UserAvatarProps> = ({user, ...props}) => {
  return (
    <Avatar {...props}>
      {
        user.image ? (
          <div className="relative aspect-square h-full w-full">
            <Image
              fill
              src={user.image}
              alt="profile picture"
              referrerPolicy='no-referrer'
            />
          </div>
        ) : (
          <AvatarFallback className="bg-gray-300">
            {
              user?.name ? user.name : <User2 />
            }
          </AvatarFallback>
        )
      }
    </Avatar>
  );
};

export default UserAvatar;