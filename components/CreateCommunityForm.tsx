'use client'

import {Input} from "@/components/ui/Input";
import {Checkbox} from "@/components/ui/Checkbox";
import {Label} from "@/components/ui/Label";
import {Badge} from "@/components/ui/Badge";
import {Button} from "@/components/ui/Button";
import {CgSpinner} from "react-icons/cg";
import {useState} from "react";
import {useRouter} from "next/navigation";
import {useMutation} from "@tanstack/react-query";
import {CreateCommunitySchema} from "@/lib/validators/community";
import axios, {AxiosError} from "axios";
import toast from "react-hot-toast";

const CreateCommunityForm = () => {
  const [input, setInput] = useState('');
  const [nsfwChecked, setNsfwChecked] = useState(false);
  const router = useRouter();

  const {mutate: createCommunity, isLoading} = useMutation({
    mutationFn: async () => {
      const payload: CreateCommunitySchema = {
        name: input.trim(),
        isNsfw: nsfwChecked,
      }
      const { data } = await axios.post('/api/community', payload);
      return data as string;
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response?.status === 409) {
          return toast.error('Community already exists');
        }
        if (err.response?.status === 422) {
          return toast.error('Community name must be between 3 and 21 characters');
        }
        if (err.response?.status === 401) {
          toast.error('You must be signed in');
          return router.push('/sign-in');
        }
      }
      return toast.error('Could not create community');
    },
    onSuccess: (data) => {
      toast.success('Community created successfully');
      return router.push(`/c/${data}`)
    }
  });

  return (
    <>
      <div className="space-y-1">
        <p className="text-lg font-medium">
          Name
        </p>
        <p className="text-xs pb-2">
          Community names cannot be changed once set
        </p>
        <div className="relative">
          <p className="absolute text-sm left-0 w-8 inset-y-0 grid place-items-center text-gray-400">
            c/
          </p>
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value.trim())}
            className="pl-6"
          />
        </div>
      </div>

      <div className="flex space-x-2 items-center">
        <Checkbox
          id="community_nsfw"
          className="data-[state=checked]:bg-rose-500"
          checked={nsfwChecked}
          onClick={() => setNsfwChecked(!nsfwChecked)}
        />
        <div className="grid gap-1.5 leading-none">
          <Label
            htmlFor="community_nsfw"
            className="text-sm text-muted-foreground flex gap-1 items-center"
          >
            This community will contain adult (18+) content
            <Badge
              variant="outline"
              className="text-[0.5rem] px-1 py-0 border border-rose-600 text-rose-600"
            >
              NSFW
            </Badge>
          </Label>
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <Button
          variant='subtle'
          disabled={isLoading}
          onClick={() => router.back()}
        >
          Cancel
        </Button>
        <Button
          disabled={input.length === 0 || isLoading}
          onClick={() => createCommunity()}
        >
          {isLoading && <CgSpinner className="h-4 w-4 mr-2 animate-spin" />}
          Create
        </Button>
      </div>
    </>
  );
}
export default CreateCommunityForm;