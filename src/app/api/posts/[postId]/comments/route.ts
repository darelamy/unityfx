import { NextRequest, NextResponse } from "next/server";
import prismadb from "@/lib/prisma/prismadb";
import { auth } from "@/utils/auth";
import { IFile } from "@/types/File";

export const POST = async (
  req: NextRequest,
  context: { params: { postId: string } }
) => {
  const { text, files } = await req.json();
  const id = context.params.postId;
  const session = await auth();

  const comment = await prismadb.comment.create({
    data: {
      user: {
        connect: {
          login: session?.user.login,
        },
      },
      post: {
        connect: {
          id,
        },
      },
      text,
    },
  });

  if (files.length !== 0) {
    await Promise.all(
      files.map(async (file: IFile) => {
        await prismadb.commentFile.create({
          data: {
            commentId: comment.id,
            fileName: file.fileName,
            fileUrl: file.fileUrl,
            fileType: file.fileType,
          },
        });
      })
    );
  }

  return NextResponse.json(
    {
      comment: { ...comment, likes: [], files, user: session?.user },
      message: "Post comment successfully created",
    },
    { status: 201 }
  );
};
