import {NextRequest, NextResponse} from "next/server";
import {CommentVoteValidator} from "@/lib/validators/vote";
import {getAuthSession} from "@/lib/auth";
import prisma from "@/lib/prismadb";
import {z} from "zod";

export const PATCH = async (req: NextRequest) => {
  try {
    const body = await req.json();

    const { commentId, voteType } = CommentVoteValidator.parse(body);

    const session = await getAuthSession();

    if (!session?.user) {
      return new NextResponse('Unauthorised', { status: 401 });
    }

    const existingVote = await prisma.commentVote.findFirst({
      where: {
        userId: session.user.id,
        commentId,
      },
    });

    if (existingVote) {
      if (existingVote.type === voteType) {
        await prisma.commentVote.delete({
          where: {
            userId_commentId: {
              commentId,
              userId: session.user.id,
            },
          },
        });

        return new NextResponse('OK');
      }

      await prisma.commentVote.update({
        where: {
          userId_commentId: {
            commentId,
            userId: session.user.id,
          },
        },
        data: {
          type: voteType,
        },
      });

      return new NextResponse('OK');
    }

    await prisma.commentVote.create({
      data: {
        type: voteType,
        userId: session.user.id,
        commentId,
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