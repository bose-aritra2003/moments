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

interface CommentDeleteBtnProps {
  id: string;
}

const CommentDeleteBtn: FC<CommentDeleteBtnProps> = ({ id }) => {
  const router = useRouter();

  const {mutate: deleteComment, isLoading} = useMutation({
    mutationFn: async () => {
      await axios.delete(`/api/community/post/comment?q=${id}`);
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response?.status === 422) {
          return toast.error('Invalid request');
        }
        if (err.response?.status === 401) {
          toast.error('You are not authorized to delete this comment');
          return router.push('/sign-in');
        }
      }
      return toast.error('Could not delete comment, please try again later');
    },
    onSuccess: () => {
      toast.success('Comment deleted successfully');
      return router.refresh();
    }
  });

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          size='icon'
          variant='ghost'
          disabled={isLoading}
          aria-label='delete comment'
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
            Once the comment is deleted, all of its data including replies will be permanently deleted.
            This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Close asChild>
            <Button
              variant="subtle"
              disabled={isLoading}
              aria-label='cancel deleting comment'
            >
              Cancel
            </Button>
          </Close>
          <Button
            variant="destructive"
            disabled={isLoading}
            aria-label='confirm delete comment'
            onClick={() => deleteComment()}
          >
            { isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" /> }
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
export default CommentDeleteBtn;