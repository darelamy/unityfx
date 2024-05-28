import { NextRequest, NextResponse } from "next/server";
import prismadb from "@/lib/prisma/prismadb";

export const DELETE = async (
  req: NextRequest,
  context: {
    params: { id: string; commentId: string; likeId: string };
  }
) => {
  const likeId = context.params.likeId;

  const like = await prismadb.postLike.delete({
    where: { id: likeId },
  });

  return NextResponse.json(
    { like, message: "Post like successfully deleted" },
    { status: 200 }
  );
};
