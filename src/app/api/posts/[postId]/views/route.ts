import { NextRequest, NextResponse } from "next/server";
import prismadb from "@/lib/prisma/prismadb";
import { auth } from "@/utils/auth";

export async function POST(
  req: NextRequest,
  context: {
    params: { postId: string };
  }
) {
  const session = await auth();

  const post = await prismadb.post.findUnique({
    where: {
      id: context.params.postId,
    },
    include: {
      views: true,
    },
  });

  if (post && !post.views.some((view) => view.userId === session?.user.id)) {
    await prismadb.post.update({
      where: {
        id: context.params.postId,
      },
      data: {
        viewsCount: {
          increment: 1,
        },
      },
    });

    await prismadb.view.create({
      data: {
        postId: context.params.postId,
        userId: session?.user.id as string,
      },
    });

    return NextResponse.json({ status: 200 });
  }
}
