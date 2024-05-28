import { NextRequest, NextResponse } from "next/server";
import prismadb from "@/lib/prisma/prismadb";

export const DELETE = async (
  req: NextRequest,
  context: {
    params: { commentId: string };
  }
) => {
  const commentId = context.params.commentId;

  const comment = await prismadb.comment.delete({
    where: { id: commentId },
  });

  return NextResponse.json(
    { comment, message: "Comment successfully deleted" },
    { status: 200 }
  );
};
