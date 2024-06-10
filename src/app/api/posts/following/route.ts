import { NextRequest, NextResponse } from "next/server";
import prismadb from "@/lib/prisma/prismadb";
import { auth } from "@/utils/auth";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "5", 10);

  const session = await auth();

  const user = await prismadb.user.findUnique({
    where: {
      id: session?.user.id,
    },
    include: {
      following: {
        include: {
          Post: {
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
          },
        },
      },
    },
  });

  const followingPosts = user?.following.flatMap(
    (followedUser) => followedUser.Post
  );

  const startIndex = (page - 1) * limit;
  const paginatedPosts = followingPosts?.slice(startIndex, startIndex + limit);

  return NextResponse.json({ posts: paginatedPosts });
}
