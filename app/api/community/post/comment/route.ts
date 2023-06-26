import {NextRequest, NextResponse} from "next/server";
import {CommentValidator} from "@/lib/validators/comment";
import {getAuthSession} from "@/lib/auth";
import prisma from "@/lib/prismadb";
import {z} from "zod";
import deleteCommentReplies from "@/actions/deleteCommentReplies";

export const PATCH = async (req: NextRequest) => {
  try {
    const body = await req.json();

    const { postId, text, replyToId } = CommentValidator.parse(body);

    const session = await getAuthSession();

    if (!session?.user) {
      return new NextResponse('Unauthorised', { status: 401 });
    }

    await prisma.comment.create({
      data: {
        text,
        postId,
        authorId: session.user.id,
        replyToId,
      },
    });

    return new NextResponse('OK');
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new NextResponse(error.message, { status: 422 });
    }
    return new NextResponse('Could not create comment, please try again later', { status: 500 });
  }
}

export const DELETE = async (req: NextRequest) => {
  try {
    const session = await getAuthSession();

    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const url = new URL(req.url);
    const query = url.searchParams.get('q');

    if (!query) {
      return new NextResponse('Invalid request', { status: 400 });
    }

    const comment = await prisma.comment.findUnique({
      where: {
        id: query,
      },
    });

    if (!comment) {
      return new NextResponse('Comment does not exist', { status: 404 });
    }

    if (comment.authorId !== session.user.id) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    await prisma.$transaction(async (tx) => {
      // Recursive delete all comments and replies
      await deleteCommentReplies(comment.id, tx);
    });

    return new NextResponse('OK');
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new NextResponse(error.message, { status: 422 });
    }
    return new NextResponse('Could not delete comment', { status: 500 });
  }
}