import { NextRequest, NextResponse } from "next/server";
import prismadb from "@/lib/prisma/prismadb";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("query");

  if (!query)
    return NextResponse.json(
      { error: "Query parameter is required" },
      { status: 400 }
    );

  try {
    const mode = searchParams.get("mode");

    if (mode === "posts") {
      const posts = await prismadb.post.findMany({
        where: {
          textContent: {
            contains: query,
            mode: "insensitive",
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
          files: true,
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

      return NextResponse.json(posts, { status: 200 });
    } else if (mode === "users") {
      const users = await prismadb.user.findMany({
        where: {
          login: {
            contains: query,
            mode: "insensitive",
          },
        },
        select: {
          id: true,
          login: true,
          avatarUrl: true,
          followedByIDs: true,
          followingIDs: true,
        },
      });
      return NextResponse.json(users, { status: 200 });
    } else if (mode === "tags") {
      const posts = await prismadb.post.findMany({
        where: {
          tags: {
            has: query,
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
          files: true,
          comments: true,
          views: true,
        },
      });
      return NextResponse.json(posts, { status: 200 });
    } else {
      return NextResponse.json(
        { error: "Invalid search mode" },
        { status: 400 }
      );
    }
  } catch (err) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
