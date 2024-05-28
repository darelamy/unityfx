import * as bcrypt from "bcrypt";
import prismadb from "@/lib/prisma/prismadb";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  const { email, login, password } = await req.json();

  if (!email || !password || !login)
    return new NextResponse("Почта, логин и пароль обязательны", {
      status: 400,
    });

  const existingEmail = await prismadb.user.findUnique({
    where: {
      email,
    },
  });

  const existingLogin = await prismadb.user.findUnique({
    where: {
      login,
    },
  });

  if (existingEmail)
    return new NextResponse("Email занят", {
      status: 400,
    });

  if (existingLogin)
    return new NextResponse("Логин занят", {
      status: 400,
    });

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await prismadb.user.create({
    data: {
      login,
      email,
      avatarUrl: "",
      desc: "",
      followersCount: 0,
      followsCount: 0,
      passwordHash,
    },
  });

  return NextResponse.json(user);
};
