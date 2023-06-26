'use client'

import {FC, startTransition} from 'react';
import {Button} from "@/components/ui/Button";
import {useMutation} from "@tanstack/react-query";
import {SubscribeToCommunitySchema} from "@/lib/validators/community";
import axios, {AxiosError} from "axios";
import toast from "react-hot-toast";
import {useRouter} from "next/navigation";
import {Loader2} from "lucide-react";

interface SubscribeLeaveToggleProps {
  communityId: string;
  communityName: string;
  isSubscribed: boolean;
}

const SubscribeLeaveToggle: FC<SubscribeLeaveToggleProps> = ({ communityId, communityName, isSubscribed }: SubscribeLeaveToggleProps) => {
  const router = useRouter();

  const { mutate: subscribe, isLoading: isSubscribeLoading } = useMutation({
    mutationFn: async () => {
      const payload: SubscribeToCommunitySchema = {
        communityId
      };

      const { data } = await axios.post('/api/community/subscribe', payload);
      return data as string;
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response?.status === 401) {
          toast.error('You must be signed in');
          return router.push('/sign-in');
        }
      }
      return toast.error('Something went wrong, please try again')
    },
    onSuccess: () => {
      startTransition(() => {
        router.refresh();
      });

      return toast.success(`You are now subscribed to c/${communityName}`)
    }
  });

  const { mutate: unsubscribe, isLoading: isUnsubscribeLoading } = useMutation({
    mutationFn: async () => {
      const payload: SubscribeToCommunitySchema = {
        communityId
      };

      const { data } = await axios.post('/api/community/unsubscribe', payload);
      return data as string;
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response?.status === 401) {
          toast.error('You must be signed in');
          return router.push('/sign-in');
        }
      }
      return toast.error('Something went wrong, please try again')
    },
    onSuccess: () => {
      startTransition(() => {
        router.refresh();
      });

      return toast.success(`You are now unsubscribed from c/${communityName}`)
    }
  });

  return (
    <>
      {
        isSubscribed ? (
          <Button
            onClick={() => unsubscribe()}
            disabled={isUnsubscribeLoading}
            variant="destructive"
            className="w-full mt-1 mb-4"
          >
            {isUnsubscribeLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            Leave community
          </Button>
        ) : (
          <Button
            onClick={() => subscribe()}
            disabled={isSubscribeLoading}
            className="w-full mt-1 mb-4"
          >
            {isSubscribeLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            Subscribe to post
          </Button>
        )
      }
    </>
  );
};

export default SubscribeLeaveToggle;