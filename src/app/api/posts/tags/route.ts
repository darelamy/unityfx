import prismadb from "@/lib/prisma/prismadb";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const data = await prismadb.post.findMany({
    where: {
      tags: {
        has: req.nextUrl.searchParams.get("tag"),
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

  return NextResponse.json(data, { status: 200 });
}
