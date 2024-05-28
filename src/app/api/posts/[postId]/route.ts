import { NextRequest, NextResponse } from "next/server";
import prismadb from "@/lib/prisma/prismadb";

export const DELETE = async (
  req: NextRequest,
  context: {
    params: { postId: string };
  }
) => {
  const postId = context.params.postId;

  const comment = await prismadb.post.delete({
    where: { id: postId },
  });

  return NextResponse.json(
    { comment, message: "Post successfully deleted" },
    { status: 200 }
  );
};
