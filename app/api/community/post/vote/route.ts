import {NextRequest, NextResponse} from "next/server";
import {PostVoteValidator} from "@/lib/validators/vote";
import {getAuthSession} from "@/lib/auth";
import prisma from "@/lib/prismadb";
import {z} from "zod";

export const PATCH = async (req: NextRequest) => {
  try {
    const body = await req.json();

    const { postId, voteType } = PostVoteValidator.parse(body);

    const session = await getAuthSession();

    if (!session?.user) {
      return new NextResponse('Unauthorised', { status: 401 });
    }

    const existingVote = await prisma.vote.findFirst({
      where: {
        userId: session.user.id,
        postId,
      },
    });

    const post = await prisma.post.findUnique({
      where: {
        id: postId
      },
      include: {
        author: true,
        votes: true,
      },
    });

    if (!post) {
      return new NextResponse('Post not found', { status: 404 });
    }

    if (existingVote) {
      if (existingVote.type === voteType) {
        await prisma.vote.delete({
          where: {
            userId_postId: {
              postId,
              userId: session.user.id,
            },
          },
        });

        return new NextResponse('OK');
      }

      await prisma.vote.update({
        where: {
          userId_postId: {
            postId,
            userId: session.user.id,
          },
        },
        data: {
          type: voteType,
        },
      });

      return new NextResponse('OK');
    }

    await prisma.vote.create({
      data: {
        type: voteType,
        userId: session.user.id,
        postId
      },
    });

    return new NextResponse('OK');
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new NextResponse(error.message, { status: 422 });
    }
    return new NextResponse('Could not vote, please try again later', { status: 500 });
  }
}