import { NextRequest, NextResponse } from "next/server";
import prismadb from "@/lib/prisma/prismadb";
import { auth } from "@/utils/auth";

export const POST = async (
  req: NextRequest,
  context: {
    params: { postId: string };
  }
) => {
  const session = await auth();

  const post = await prismadb.post.findUnique({
    where: {
      id: context.params.postId,
    },
    include: {
      likes: {
        include: {
          user: true,
        },
      },
    },
  });

  if (post && !post.likes.some((like) => like.user.id === session?.user.id)) {
    const like = await prismadb.postLike.create({
      data: {
        user: {
          connect: {
            login: session?.user.login,
          },
        },
        post: {
          connect: {
            id: context.params.postId,
          },
        },
        createdAt: new Date(),
      },
    });

    return NextResponse.json(
      { like, message: "Post like successfully created" },
      { status: 201 }
    );
  }

  return NextResponse.json({ message: "Post already liked" }, { status: 400 });
};
