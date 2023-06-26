'use client'

import {FC, useEffect, useState} from 'react';
import {useForm} from "react-hook-form";
import {SettingsSchema, SettingsValidator} from "@/lib/validators/settings";
import {zodResolver} from "@hookform/resolvers/zod";
import {User} from "@prisma/client";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/Card";
import {Label} from "@/components/ui/Label";
import {Input} from "@/components/ui/Input";
import {Button} from "@/components/ui/Button";
import {useMutation} from "@tanstack/react-query";
import axios, {AxiosError} from "axios";
import toast from "react-hot-toast";
import {useRouter} from "next/navigation";
import {uploadFiles} from "@/lib/uploadthing";
import {ZodError} from "zod";
import {getRandomUsername} from "@/lib/utils";
import {CgSpinner} from "react-icons/cg";
import {AlertCircle, RotateCw, UserCircle2} from "lucide-react";

interface UserNameFormProps {
  user: Pick<User, 'id' | 'username' | 'image'>;
}

const UserNameForm: FC<UserNameFormProps> = ({ user }) => {
  const router = useRouter();
  const [randomUsername, setRandomUsername] = useState('');

  useEffect(() => {
    setRandomUsername(getRandomUsername());
  }, []);

  const {
    reset,
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<SettingsSchema>({
    resolver: zodResolver(SettingsValidator),
    defaultValues: {
      name: user?.username || '',
      image: null,
    },
  });

  const { mutate: updateProfile, isLoading } = useMutation({
    mutationFn: async ({ name, image }: SettingsSchema) => {
      const imageFile = image?.item(0);
      let image_url = null;
      if (imageFile) {
        const [res] = await uploadFiles([imageFile], 'imageUploader')
        image_url = res.fileUrl;
      }
      const payload: SettingsSchema = { name, image_url };
      const { data } = await axios.patch('/api/settings', payload);
      return data;
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response?.status === 409) {
          return toast.error('Username already taken, please choose a different username');
        }
      }
      if (err instanceof ZodError) {
        return toast.error(err.message);
      }
      return toast.error('Could not update profile');
    },
    onSuccess: () => {
      toast.success('Profile updated successfully');
      return router.refresh();
    }
  });

  return (
    <form onSubmit={handleSubmit((e) => updateProfile(e))}>
      <Card>
        <CardDescription>
          <p className="text-md flex flex-wrap gap-1 items-center justify-center text-gray-500 pt-6">
            <AlertCircle className="h-5 w-5 text-rose-600" />
            Information on this card is visible to everyone
          </p>
        </CardDescription>
        <CardHeader>
          <CardTitle>Username</CardTitle>
          <CardDescription>
            <p className="flex gap-1 flex-wrap items-center text-muted-foreground">
              Let&apos;s choose a cool username. How about something like

              <span
                className="font-medium italic cursor-pointer hover:text-black transition-colors"
                onClick={() => reset({ name: randomUsername })}
              >
                {randomUsername}
              </span>
              <span
                className="pl-1 cursor-pointer hover:text-black transition-colors"
                onClick={() => setRandomUsername(getRandomUsername())}
              >
                <RotateCw className="h-4 w-4" />
              </span>
            </p>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative grid gap-1">
            <div className="absolute top-0 left-0 w-8 h-10 grid place-items-center">
              <span className="text-sm text-gray-400">u/</span>
            </div>
            <Label
              htmlFor="name"
              className="sr-only"
            >
              Name
            </Label>
            <div className="flex gap-2 items-center">
              <Input
                id="name"
                size={32}
                className="pl-6"
                {...register('name')}
              />
              <Button
                type="button"
                variant='ghost'
                size='sm'
                onClick={() => reset({ name: user.username! })}
              >
                reset
              </Button>
            </div>
            {
              errors?.name && (
                <p className="px-1 text-xs text-rose-500">
                  {errors.name.message}
                </p>
              )
            }
          </div>
        </CardContent>

        <CardHeader>
          <CardTitle>Profile photo</CardTitle>
          <CardDescription>
            Your profile photo is displayed when you comment on a post. Size of image file should be 4MB or less
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative grid gap-1">
            <div className="absolute top-0 left-0 w-8 h-10 grid place-items-center">
              <span className="text-sm text-gray-400">
                <UserCircle2 className="h-4 w-4" />
              </span>
            </div>
            <Label
              htmlFor="picture"
              className="sr-only"
            >
              Profile photo
            </Label>
            <div className="flex gap-2 items-center">
              <Input
                id="picture"
                type="file"
                accept="image/*"
                multiple={false}
                size={32}
                className="pl-6 cursor-pointer"
                {...register('image')}
              />
              <Button
                type="button"
                variant='ghost'
                size='sm'
                onClick={() => reset({ image: null })}
              >
                reset
              </Button>
            </div>

            {
              errors?.image && (
                <p className="px-1 text-xs text-rose-500">
                  {errors.image.message}
                </p>
              )
            }
          </div>
        </CardContent>

        <CardFooter>
          <Button
            type="submit"
            disabled={isLoading}
          >
            {isLoading && <CgSpinner className="h-4 w-4 mr-2 animate-spin" />}
            Update
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
};

export default UserNameForm;