import { NextRequest, NextResponse } from "next/server";
import prismadb from "@/lib/prisma/prismadb";

export async function GET(req: NextRequest) {
  const popularPosts = await prismadb.post.findMany({
    take: 10,
    orderBy: {
      likes: {
        _count: "desc",
      },
    },
    include: {
      user: {
        select: {
          id: true,
          login: true,
          avatarUrl: true,
        },
      },
      files: true,
      likes: {
        include: {
          user: {
            select: {
              id: true,
              login: true,
              avatarUrl: true,
            },
          },
        },
      },
      comments: {
        include: {
          user: {
            select: {
              id: true,
              login: true,
              avatarUrl: true,
            },
          },
          post: true,
          files: true,
          likes: {
            include: {
              user: {
                select: {
                  id: true,
                  login: true,
                  avatarUrl: true,
                },
              },
              comment: true,
            },
          },
        },
      },
      views: true,
    },
  });

  const totalPosts = await prismadb.post.count();

  return NextResponse.json({ posts: popularPosts, total: totalPosts });
}
