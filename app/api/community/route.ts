import {NextRequest, NextResponse} from "next/server";
import {getAuthSession} from "@/lib/auth";
import {CommunityValidator} from "@/lib/validators/community";
import prisma from "@/lib/prismadb";
import {z} from "zod";
import deletePostComments from "@/actions/deletePostComments";

export const POST = async (req: NextRequest) => {
  try {
    const session = await getAuthSession();

    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = await req.json();
    const { name, isNsfw } = CommunityValidator.parse(body);

    const communityExists = await prisma.community.findFirst({
      where: {
        name,
      },
    })

    if (communityExists) {
      return new NextResponse('Community already exists', { status: 409 });
    }

    const community = await prisma.community.create({
      data: {
        name,
        isNsfw,
        creatorId: session.user.id,
      },
    });

    await prisma.subscription.create({
      data: {
        userId: session.user.id,
        communityId: community.id,
      },
    });

    return new NextResponse(community.name);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new NextResponse(error.message, { status: 422 });
    }
    return new NextResponse('Could not create community', { status: 500 });
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

    const community = await prisma.community.findFirst({
      where: {
        name: query,
      },
    });

    if (!community) {
      return new NextResponse('Community does not exist', { status: 404 });
    }

    if (community.creatorId !== session.user.id) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    await prisma.$transaction(async (tx) => {
      // Delete comments and replies from all posts
      const posts = await tx.post.findMany({
        where: {
          communityId: community.id,
        },
      });

      for (const post of posts) {
        await deletePostComments(post.id, tx);
      }

      // Delete community
      await tx.community.delete({
        where: {
          id: community.id,
        },
      });
    })

    return new NextResponse(community.name);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new NextResponse(error.message, { status: 422 });
    }
    return new NextResponse('Could not delete community', { status: 500 });
  }
}

