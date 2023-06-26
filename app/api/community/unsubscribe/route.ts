import {NextRequest, NextResponse} from "next/server";
import {getAuthSession} from "@/lib/auth";
import {CommunitySubscriptionValidator} from "@/lib/validators/community";
import prisma from "@/lib/prismadb";
import {z} from "zod";

export const POST = async (req: NextRequest) => {
  try {
    const session = await getAuthSession();

    if (!session?.user) {
      return new NextResponse('Unauthorised', { status: 401 });
    }

    const body = await req.json();

    const { communityId } = CommunitySubscriptionValidator.parse(body);

    const subscriptionExists = await prisma.subscription.findFirst({
      where: {
        communityId,
        userId: session.user.id,
      },
    });

    if (!subscriptionExists) {
      return new NextResponse('You are not subscribed to this community', { status: 400 });
    }

    const isCommunityCreator = await prisma.community.findFirst({
      where: {
        id: communityId,
        creatorId: session.user.id,
      },
    });

    if (isCommunityCreator) {
      return new NextResponse('You cannot unsubscribe from your own community', { status: 400 })
    }

    await prisma.subscription.delete({
      where: {
        userId_communityId: {
          communityId,
          userId: session.user.id,
        },
      },
    });

    return new NextResponse(communityId);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new NextResponse(error.message, { status: 422 });
    }
    return new NextResponse('Could not unsubscribe, please try again later', { status: 500 });
  }
}