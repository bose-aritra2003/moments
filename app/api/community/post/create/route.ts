import {NextRequest, NextResponse} from "next/server";
import {getAuthSession} from "@/lib/auth";
import prisma from "@/lib/prismadb";
import {z} from "zod";
import {PostValidator} from "@/lib/validators/post";

export const POST = async (req: NextRequest) => {
  try {
    const session = await getAuthSession();

    if (!session?.user) {
      return new NextResponse('Unauthorised', { status: 401 });
    }

    const body = await req.json();

    const { title, communityId, isNsfw, content } = PostValidator.parse(body);

    const subscriptionExists = await prisma.subscription.findFirst({
      where: {
        communityId,
        userId: session.user.id,
      },
    });

    if (!subscriptionExists) {
      return new NextResponse('You need to be subscribed to this community to create a post here', { status: 400 });
    }

    await prisma.post.create({
      data: {
        title,
        content,
        isNsfw,
        authorId: session.user.id,
        communityId
      }
    })

    return new NextResponse('OK');
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new NextResponse(error.message, { status: 422 });
    }
    return new NextResponse('Could not post to community, please try again later', { status: 500 });
  }
}