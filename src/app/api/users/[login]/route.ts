import { NextRequest, NextResponse } from "next/server";
import prismadb from "@/lib/prisma/prismadb";

export async function GET(
  req: NextRequest,
  context: {
    params: { login: string };
  }
) {
  const { searchParams } = new URL(req.url);

  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "5", 10);

  const user = await prismadb.user.findUnique({
    where: {
      login: context.params.login,
    },
  });

  if (!user)
    return NextResponse.json({ message: "User not found" }, { status: 404 });

  const [posts, total] = await Promise.all([
    prismadb.post.findMany({
      where: {
        user: {
          login: context.params.login,
        },
      },
      skip: (page - 1) * limit,
      take: limit,
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
    }),
    prismadb.post.count(),
  ]);

  const { passwordHash, email, ...data } = user;

  return NextResponse.json({ user: data, posts, total });
}
