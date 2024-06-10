import { NextRequest, NextResponse } from "next/server";
import prismadb from "@/lib/prisma/prismadb";
import { auth } from "@/utils/auth";
import { IFile } from "@/types/File";
import { OutputBlockData } from "@editorjs/editorjs";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "5", 10);

  const [posts, total] = await Promise.all([
    prismadb.post.findMany({
      skip: (page - 1) * limit,
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        user: {
          select: {
            id: true,
            login: true,
            avatarUrl: true,
          },
        },
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
          },
        },
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
    }),
    prismadb.post.count(),
  ]);

  return NextResponse.json({ posts, total });
}

export async function POST(req: NextRequest) {
  const { body, files, programs, tags } = await req.json();

  const session = await auth();

  const textContent = body
    .map((block: OutputBlockData["data"]) => block.data.text)
    .join(" ");

  const post = await prismadb.post.create({
    data: {
      user: {
        connect: {
          login: session?.user?.login,
        },
      },
      body,
      textContent,
      programs,
      tags,
      viewsCount: 0,
    },
  });

  if (files.length !== 0) {
    await Promise.all(
      files.map(async (file: IFile) => {
        await prismadb.postFile.create({
          data: {
            postId: post.id,
            fileName: file.fileName,
            fileUrl: file.fileUrl,
            fileType: file.fileType,
          },
        });
      })
    );
  }

  return NextResponse.json(
    { post, message: "Post successfully created" },
    { status: 201 }
  );
}
