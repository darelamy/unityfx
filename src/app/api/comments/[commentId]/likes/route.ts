import { NextRequest, NextResponse } from "next/server";
import prismadb from "@/lib/prisma/prismadb";
import { auth } from "@/utils/auth";

export const POST = async (
  req: NextRequest,
  context: {
    params: { commentId: string };
  }
) => {
  const { postId } = await req.json();

  const commentId = context.params.commentId;

  const session = await auth();

  const like = await prismadb.commentLike.create({
    data: {
      user: {
        connect: {
          login: session?.user.login,
        },
      },
      comment: {
        connect: {
          id: commentId,
        },
      },
      post: {
        connect: {
          id: postId,
        },
      },
    },
  });

  return NextResponse.json(
    { like, message: "Comment like successfully created" },
    { status: 201 }
  );
};
