import { NextRequest, NextResponse } from "next/server";
import prismadb from "@/lib/prisma/prismadb";
import { auth } from "@/utils/auth";

export async function PATCH(req: NextRequest) {
  const { avatarUrl } = await req.json();

  const session = await auth();

  if (!session)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  session.user.avatarUrl = avatarUrl;

  await prismadb.user.update({
    where: {
      login: session?.user?.login,
    },
    data: {
      avatarUrl,
    },
  });

  return NextResponse.json(
    { message: "User avatar successfully updated" },
    { status: 200 }
  );
}
