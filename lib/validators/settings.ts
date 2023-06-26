import { z } from 'zod'

const MAX_FILE_SIZE = 400000;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

export const SettingsValidator = z.object({
  name: z
    .string()
    .min(3)
    .max(32)
    .regex(/^[a-zA-Z0-9-]+$/, "a-z, A-Z, 0-9 and - are the only allowed characters"),

  image: z.custom<FileList>().nullish()

    .refine((files) => {
      if (!files || files?.length === 0) {
        return true;
      }
      return files?.length === 1;
    }, "You can only upload one image at a time")

    .refine((files) => {
      if (!files || files?.length === 0) {
        return true;
      }
      return files?.[0]?.size <= MAX_FILE_SIZE;
    }, "Maximum upload size is 4MB")

    .refine((files) => {
      if (!files || files?.length === 0) {
        return true;
      }
      return ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type);
    }, "Only .jpg, .jpeg, .png and .webp files are accepted"),

  image_url: z.string().nullish(),
});

export type SettingsSchema = z.infer<typeof SettingsValidator>;