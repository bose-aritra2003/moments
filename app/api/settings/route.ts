import {NextRequest, NextResponse} from "next/server";
import {getAuthSession} from "@/lib/auth";
import {SettingsValidator} from "@/lib/validators/settings";
import prisma from "@/lib/prismadb";
import {z} from "zod";

export const PATCH = async (req: NextRequest) => {
  try {
    const session = await getAuthSession();

    if (!session?.user) {
      return new NextResponse('Unauthorised', { status: 401 });
    }

    const body = await req.json();
    const { name, image_url } = SettingsValidator.parse(body);

    const userExists = await prisma.user.findFirst({
      where: {
        username: name
      },
    });

    if (userExists && userExists.id !== session.user.id) {
      return new NextResponse('Username already taken', { status: 409 });
    }

    if (session.user.username === name) {
      if (image_url) {
        await prisma.user.update({
          where: {
            id: session.user.id,
          },
          data: {
            image: image_url,
          },
        });
      }
      return new NextResponse('OK');
    }

    if (image_url) {
      await prisma.user.update({
        where: {
          id: session.user.id,
        },
        data: {
          username: name,
          image: image_url,
        },
      });

      return new NextResponse('OK');
    }

    await prisma.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        username: name,
      },
    });

    return new NextResponse('OK');
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new NextResponse(error.message, { status: 422 });
    }
    return new NextResponse('Could not update username or profile photo, please try again later', { status: 500 });
  }
}