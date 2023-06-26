'use client'

import {FC, useState} from 'react';
import {Label} from "@/components/ui/Label";
import {Textarea} from "@/components/ui/Textarea";
import {Button} from "@/components/ui/Button";
import {useMutation} from "@tanstack/react-query";
import {CommentSchema} from "@/lib/validators/comment";
import axios from "axios";
import {AxiosError} from "axios";
import toast from "react-hot-toast";
import {useRouter} from "next/navigation";
import {Loader2} from "lucide-react";

interface CreateCommentProps {
  postId: string;
  replyToId?: string;
}

const CreateComment: FC<CreateCommentProps> = ({ postId, replyToId }) => {
  const [input, setInput] = useState('');
  const router = useRouter();

  const { mutate: comment, isLoading } = useMutation({
    mutationFn: async ({postId, text, replyToId}: CommentSchema) => {
      const payload: CommentSchema = {
        postId, text, replyToId,
      }

      const { data } = await axios.patch('/api/community/post/comment', payload);
      return data;
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
      router.refresh();
      setInput('');
    }
  })

  return (
    <div className="grid w-full gap-1.5">
      <Label htmlFor='comment'>
        Your comment
      </Label>
      <div className="mt-2">
        <Textarea
          id='comment'
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder='What are your thoughts?'
        />
        <div className="mt-2 flex justify-end">
          <Button
            disabled={input.length === 0 || isLoading}
            onClick={() => comment({ postId, text: input, replyToId })}
          >
            { isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" /> }
            Comment
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreateComment;