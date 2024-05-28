import { NextRequest, NextResponse } from "next/server";
import prismadb from "@/lib/prisma/prismadb";

export async function GET(
  req: NextRequest,
  context: { params: { login: string } }
) {
  const user = await prismadb.user.findUnique({
    where: { login: context.params.login },
    include: { following: true },
  });

  return NextResponse.json(user?.following, { status: 200 });
}
