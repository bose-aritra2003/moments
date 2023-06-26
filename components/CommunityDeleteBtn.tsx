'use client'

import {FC} from "react";
import {Button} from "@/components/ui/Button";
import {AlertTriangle, Loader2, Trash2} from "lucide-react";
import {useRouter} from "next/navigation";
import {useMutation} from "@tanstack/react-query";
import axios, {AxiosError} from "axios";
import toast from "react-hot-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription, DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/Dialog";
import {Close} from "@radix-ui/react-dialog";

interface CommunityDeleteBtnProps {
  name: string;
}

const CommunityDeleteBtn: FC<CommunityDeleteBtnProps> = ({ name }) => {
  const router = useRouter();

  const {mutate: deleteCommunity, isLoading} = useMutation({
    mutationFn: async () => {
      await axios.delete(`/api/community?q=${name}`);
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response?.status === 422) {
          return toast.error('Invalid request');
        }
        if (err.response?.status === 401) {
          toast.error('You are not authorized to delete this community');
          return router.push('/sign-in');
        }
      }
      return toast.error('Could not delete community, please try again later');
    },
    onSuccess: () => {
      toast.success('Community deleted successfully');
      return router.push('/');
    }
  });

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          size='icon'
          variant='ghost'
          disabled={isLoading}
          aria-label='delete community'
        >
          <Trash2 className="h-5 w-5 text-rose-600"/>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            <div className="flex gap-2 items-center">
              <AlertTriangle className="h-5 w-5 text-rose-600" />
              Confirm delete
            </div>
          </DialogTitle>
          <DialogDescription className="pt-3 text-left">
            Once the community is deleted, all of its data including posts and comments will be permanently deleted.
            This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Close asChild>
            <Button
              variant="subtle"
              disabled={isLoading}
              aria-label='cancel deleting community'
            >
              Cancel
            </Button>
          </Close>
          <Button
            variant="destructive"
            disabled={isLoading}
            aria-label='confirm delete community'
            onClick={() => deleteCommunity()}
          >
            { isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" /> }
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
export default CommunityDeleteBtn;