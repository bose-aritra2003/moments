'use client'

import {FC} from "react";
import {Button} from "@/components/ui/Button";
import {AlertTriangle, Trash2} from "lucide-react";
import {useRouter} from "next/navigation";
import {useMutation} from "@tanstack/react-query";
import axios, {AxiosError} from "axios";
import toast from "react-hot-toast";
import {CgSpinner} from "react-icons/cg";
import {
  Dialog,
  DialogContent,
  DialogDescription, DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/Dialog";
import {Close} from "@radix-ui/react-dialog";

interface PostDeleteBtnProps {
  id: string;
}

const PostDeleteBtn: FC<PostDeleteBtnProps> = ({ id }) => {
  const router = useRouter();

  const {mutate: deletePost, isLoading} = useMutation({
    mutationFn: async () => {
      await axios.delete(`/api/posts?q=${id}`);
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response?.status === 422) {
          return toast.error('Invalid request');
        }
        if (err.response?.status === 401) {
          toast.error('You are not authorized to delete this post');
          return router.push('/sign-in');
        }
      }
      return toast.error('Could not delete post, please try again later');
    },
    onSuccess: () => {
      toast.success('Post deleted successfully');
      return router.push('/explore');
    }
  });

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          size='icon'
          variant='ghost'
          disabled={isLoading}
          aria-label='delete post'
        >
          <Trash2 className="h-4 w-4 text-rose-600"/>
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
            Once the post is deleted, all of its data including comments and votes will be permanently deleted.
            This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Close asChild>
            <Button
              variant="subtle"
              disabled={isLoading}
              aria-label='cancel deleting post'
            >
              Cancel
            </Button>
          </Close>
          <Button
            variant="destructive"
            disabled={isLoading}
            aria-label='confirm delete post'
            onClick={() => deletePost()}
          >
            { isLoading && <CgSpinner className="h-4 w-4 mr-2 animate-spin" /> }
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
export default PostDeleteBtn;