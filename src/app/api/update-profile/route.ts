import { NextRequest, NextResponse } from "next/server";
import prismadb from "@/lib/prisma/prismadb";
import { auth } from "@/utils/auth";

export async function PATCH(req: NextRequest) {
  const { login, desc } = await req.json();

  const session = await auth();

  if (!session)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  session.user = { ...session.user, login, desc };

  const existingLogin = await prismadb.user.findUnique({
    where: {
      login,
    },
  });

  if (existingLogin && existingLogin.id !== session.user.id)
    return new NextResponse("Логин занят", {
      status: 400,
    });

  const user = await prismadb.user.update({
    where: {
      id: session.user.id,
    },
    data: {
      login,
      desc,
    },
  });

  return NextResponse.json(
    { user, message: "User profile successfully updated" },
    { status: 200 }
  );
}
