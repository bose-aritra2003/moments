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

    if (subscriptionExists) {
      return new NextResponse('You are already subscribed to this community', { status: 400 });
    }

    await prisma.subscription.create({
      data: {
        communityId,
        userId: session.user.id,
      },
    });

    return new NextResponse(communityId);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new NextResponse(error.message, { status: 422 });
    }
    return new NextResponse('Could not subscribe, please try again later', { status: 500 });
  }
}