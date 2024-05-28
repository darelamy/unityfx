import { NextRequest, NextResponse } from "next/server";
import prismadb from "@/lib/prisma/prismadb";

export const DELETE = async (
  req: NextRequest,
  context: {
    params: { id: string; commentId: string; likeId: string };
  }
) => {
  const likeId = context.params.likeId;

  const like = await prismadb.commentLike.delete({
    where: { id: likeId },
  });

  return NextResponse.json(
    { like, message: "Comment like successfully deleted" },
    { status: 200 }
  );
};
