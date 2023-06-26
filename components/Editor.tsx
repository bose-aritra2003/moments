'use client'

import {FC, useCallback, useEffect, useRef, useState} from 'react';
import TextareaAutosize from "react-textarea-autosize";
import {useForm} from "react-hook-form";
import {PostCreationSchema, PostValidator} from "@/lib/validators/post";
import {zodResolver} from "@hookform/resolvers/zod";
import type EditorJS from "@editorjs/editorjs";
import {uploadFiles} from "@/lib/uploadthing";
import toast from "react-hot-toast";
import {useMutation} from "@tanstack/react-query";
import axios, {AxiosError} from "axios";
import {usePathname, useRouter} from "next/navigation";
import {z} from "zod";
import {Checkbox} from "@/components/ui/Checkbox";
import {Label} from "@/components/ui/Label";
import {Badge} from "@/components/ui/Badge";
import {Button} from "@/components/ui/Button";
import {CgSpinner} from "react-icons/cg";

interface EditorProps {
  communityId: string;
}

const Editor: FC<EditorProps> = ({ communityId }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PostCreationSchema>({
    resolver: zodResolver(PostValidator),
    defaultValues: {
      communityId,
      title: '',
      content: null,
    },
  });

  const editorRef = useRef<EditorJS>();
  const _titleRef = useRef<HTMLTextAreaElement>(null);

  const [isMounted, setIsMounted] = useState(false);
  const [nsfwChecked, setNsfwChecked] = useState(false);

  const pathname = usePathname();
  const router = useRouter();

  //Editor.js is imported in this way because it is a very heavy library
  const initialiseEditor = useCallback(async () => {
    const EditorJS = (await import('@editorjs/editorjs')).default
    const Header = (await import('@editorjs/header')).default
    const Embed = (await import('@editorjs/embed')).default
    const Table = (await import('@editorjs/table')).default
    const List = (await import('@editorjs/list')).default
    const Code = (await import('@editorjs/code')).default
    const LinkTool = (await import('@editorjs/link')).default
    const InlineCode = (await import('@editorjs/inline-code')).default
    const ImageTool = (await import('@editorjs/image')).default

    if (!editorRef.current) {
      const editor = new EditorJS({
        holder: 'editor',
        onReady() {
          editorRef.current = editor
        },
        placeholder: 'Type here to write your post...',
        inlineToolbar: true,
        data: { blocks: [] },
        tools: {
          header: Header,
          linkTool: {
            class: LinkTool,
            config: {
              endpoint: '/api/link',
            },
          },
          image: {
            class: ImageTool,
            config: {
              uploader: {
                async uploadByFile(file: File) {
                  const [res] = await uploadFiles([file], 'imageUploader')
                  return {
                    success: 1,
                    file: {
                      url: res.fileUrl,
                    },
                  }
                },
              },
            },
          },
          list: List,
          code: Code,
          inlineCode: InlineCode,
          table: Table,
          embed: Embed,
        },
      });
    }
  }, []);

  useEffect(() => {
    if (Object.keys(errors).length) {
      for(const [, value] of Object.entries(errors)) {
        toast.error((value as { message: string }).message)
      }
    }
  }, [errors]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsMounted(true);
    }
  }, []);

  useEffect(() => {
    if (isMounted) {
      //IIFE
      (async () => {
        await initialiseEditor();

        setTimeout(() => {
          _titleRef.current?.focus();
        }, 0);
      })();
      return () => {
        editorRef.current?.destroy();
        editorRef.current = undefined;
      }
    }
  }, [isMounted, initialiseEditor]);

  const { mutate: createPost, isLoading } = useMutation({
    mutationFn: async ({ title, content, isNsfw, communityId }: PostCreationSchema) => {
      const payload: PostCreationSchema = { title, content, isNsfw, communityId };
      const { data } = await axios.post('/api/community/post/create', payload);
      return data;
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response?.status === 401) {
          toast.error('You must be signed in');
          return router.push('/sign-in');
        }
        return toast.error('You are not subscribed to this community');
      }
      if (err instanceof z.ZodError) {
        return toast.error(err.message);
      }
      return toast.error('Unable to publish your post, please try again');
    },
    onSuccess: () => {
      // c/react/submit -> c/react
      const newPathname = pathname.split('/').slice(0, -1).join('/');
      router.push(newPathname);
      router.refresh();

      return toast.success('Your post has been published');
    }
  })

  const onSubmit = async (data: PostCreationSchema) => {
    const blocks = await editorRef.current?.save();

    const payload: PostCreationSchema = {
      title: data.title,
      content: blocks,
      isNsfw: nsfwChecked,
      communityId
    }

    createPost(payload);
  }

  if (!isMounted) {
    return null;
  }

  const { ref: titleRef, ...rest } = register('title');

  return (
    <div className="w-full p-4 bg-gray-50 rounded-lg border border-gray-200">
      <div className="flex space-x-2 items-center mb-4">
        <Checkbox
          id="post_nsfw"
          className="data-[state=checked]:bg-rose-500"
          checked={nsfwChecked}
          onClick={() => setNsfwChecked(!nsfwChecked)}
        />
        <div className="grid gap-1.5 leading-none">
          <Label
            htmlFor="post_nsfw"
            className="text-sm text-muted-foreground flex gap-1 items-center"
          >
            This post will contain adult (18+) content
            <Badge
              variant="outline"
              className="text-[0.5rem] px-1 py-0 border border-rose-600 text-rose-600"
            >
              NSFW
            </Badge>
          </Label>
        </div>
      </div>
      <form
        id="community-post-form"
        className="w-full flex flex-col gap-6"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="prose prose-gray dark:prose-invert">
          <TextareaAutosize
            ref={(e) => {
              titleRef(e);
              //@ts-ignore
              _titleRef.current = e;
            }}
            {...rest}
            placeholder="Title"
            className="w-full resize-none appearance-none overflow-hidden bg-transparent text-4xl font-bold focus:outline-none"
          />
          <div id="editor" className="min-h-fit" />
        </div>
        <Button
          disabled={isLoading}
          type="submit"
          className="w-full"
          form="community-post-form"
        >
          { isLoading && <CgSpinner className="h-4 w-4 mr-2 animate-spin" /> }
          Post
        </Button>
      </form>
    </div>
  );
};

export default Editor;