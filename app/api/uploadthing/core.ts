import { createUploadthing, type FileRouter } from "uploadthing/next";
import {NextRequest} from "next/server";

const f = createUploadthing();

const auth = (req: NextRequest) => ({ id: "fakeId" }); // Fake auth function

export const ourFileRouter = {
  imageUploader: f({ image: { maxFileSize: "4MB" } })
    .middleware(async (req ) => {
      const user = auth(req);

      if (!user) throw new Error("Unauthorized");

      return { userId: user.id };
    })
    .onUploadComplete(() => {}),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;