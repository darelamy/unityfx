import { NextRequest, NextResponse } from "next/server";
import prismadb from "@/lib/prisma/prismadb";

export async function POST(
  req: NextRequest,
  context: { params: { login: string } }
) {
  const { followerId, followedId } = await req.json();

  try {
    const user = await prismadb.user.findUnique({
      where: { id: followedId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (!user.followedByIDs.some((id) => id === followerId)) {
      await prismadb.user.update({
        where: { id: followedId },
        data: {
          followersCount: {
            increment: 1,
          },
        },
      });

      await prismadb.user.update({
        where: { id: followerId },
        data: {
          following: {
            connect: [{ id: followedId }],
          },
          followsCount: {
            increment: 1,
          },
        },
      });
    }

    return NextResponse.json(
      { message: "User followed successfully." },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to follow user" },
      { status: 500 }
    );
  }
}
