import {NextRequest, NextResponse} from "next/server";
import prisma from "@/lib/prismadb";
import {z} from "zod";
import {getAuthSession} from "@/lib/auth";
import deletePostComments from "@/actions/deletePostComments";

export const GET = async (req: NextRequest) => {
  const url = new URL(req.url);

  try {
    const { limit, page, communityName } = z.object({
      limit: z.string(),
      page: z.string(),
      communityName: z.string().nullish().optional(),
    }).parse({
      communityName: url.searchParams.get('communityName'),
      limit: url.searchParams.get('limit'),
      page: url.searchParams.get('page'),
    });

    let whereClause = {};

    if (communityName) {
      whereClause = {
        community: {
          name: communityName,
        },
      }
    }

    const posts = await prisma.post.findMany({
      take: parseInt(limit),
      skip: (parseInt(page) - 1) * parseInt(limit),
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        community: true,
        votes: true,
        author: true,
        comments: true,
      },
      where: whereClause,
    });

    return new NextResponse(JSON.stringify(posts));
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new NextResponse(error.message, { status: 422 });
    }
    return new NextResponse('Could not fetch more posts, please try again later', { status: 500 });
  }
};

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

    const post = await prisma.post.findUnique({
      where: {
        id: query,
      },
    });

    if (!post) {
      return new NextResponse('Post does not exist', { status: 404 });
    }

    if (post.authorId !== session.user.id) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    await prisma.$transaction(async (tx) => {
      // Delete all comments and replies
      await deletePostComments(post.id, tx);

      // Delete post
      await tx.post.delete({
        where: {
          id: post.id,
        },
      });
    });

    return new NextResponse('OK');
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new NextResponse(error.message, { status: 422 });
    }
    return new NextResponse('Could not delete post', { status: 500 });
  }
}
