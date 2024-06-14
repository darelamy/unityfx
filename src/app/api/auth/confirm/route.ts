import prismadb from "@/lib/prisma/prismadb";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  const { confirmationCode, tempToken } = await req.json();

  if (!confirmationCode || !tempToken)
    return new NextResponse("Код подтверждения и токен обязательны", {
      status: 400,
    });

  const tempUser = await prismadb.tempUser.findFirst({
    where: {
      confirmationCode,
      tempToken,
    },
  });

  if (!tempUser)
    return new NextResponse("Неверный код подтверждения", {
      status: 400,
    });

  const { email, login, passwordHash } = tempUser;

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

  await prismadb.tempUser.delete({
    where: { id: tempUser.id },
  });

  return NextResponse.json(user);
};
