import { NextRequest, NextResponse } from "next/server";
import prismadb from "@/lib/prisma/prismadb";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const limit = parseInt(searchParams.get("limit") || "10", 10);

  const popularPosts = await prismadb.post.findMany({
    take: limit,
    orderBy: {
      likes: {
        _count: "desc",
      },
    },
    include: {
      user: true,
      files: true,
      likes: {
        include: {
          user: true,
        },
      },
      comments: {
        include: {
          user: true,
          post: true,
          files: true,
          likes: {
            include: {
              user: true,
              comment: true,
            },
          },
        },
      },
      views: true,
    },
  });

  return NextResponse.json(popularPosts, { status: 200 });
}
