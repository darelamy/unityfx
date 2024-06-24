import { NextRequest, NextResponse } from "next/server";
import prismadb from "@/lib/prisma/prismadb";

export async function GET(req: NextRequest) {
  const [posts, total] = await Promise.all([
    await prismadb.post.findMany({
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
    }),
    prismadb.post.count(),
  ]);

  return NextResponse.json({ posts, total });
}
