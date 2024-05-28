import { NextRequest, NextResponse } from "next/server";
import prismadb from "@/lib/prisma/prismadb";

export async function POST(
  req: NextRequest,
  context: { params: { login: string } }
) {
  const { followerId, followedId } = await req.json();

  try {
    await prismadb.user.update({
      where: { id: followedId },
      data: {
        followersCount: {
          decrement: 1,
        },
      },
    });

    await prismadb.user.update({
      where: { id: followerId },
      data: {
        following: {
          disconnect: [{ id: followedId }],
        },
        followsCount: {
          decrement: 1,
        },
      },
    });

    return NextResponse.json(
      { message: "User unfollowed successfully." },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to unfollow user" },
      { status: 500 }
    );
  }
}
