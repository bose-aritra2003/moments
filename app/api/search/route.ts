import {NextRequest, NextResponse} from "next/server";
import prisma from "@/lib/prismadb";
import {Community} from "@prisma/client";
import {SEARCH_RESULTS} from "@/config";

export const GET = async (req: NextRequest) => {
  const url = new URL(req.url);
  const query = url.searchParams.get('q');

  let results: Community[];

  if (query && query.length > 0) {
    results = await prisma.community.findMany({
      where: {
        name: {
          startsWith: query,
        },
      },
      include: {
        _count: true,
      },
      take: SEARCH_RESULTS,
    });
  } else {
    results = await prisma.community.findMany({
      include: {
        _count: true,
      },
      take: 5,
    });
  }

  return new NextResponse(JSON.stringify(results));
}