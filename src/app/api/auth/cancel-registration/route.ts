import prismadb from "@/lib/prisma/prismadb";
import { NextResponse } from "next/server";

export const DELETE = async (req: Request) => {
  const { email } = await req.json();

  const existingUser = await prismadb.tempUser.findUnique({
    where: { email },
  });

  if (!existingUser) {
    return new NextResponse("Пользователь с таким email не найден", {
      status: 404,
    });
  }

  await prismadb.tempUser.delete({
    where: { email },
  });

  return new NextResponse("Регистрация отменена", {
    status: 200,
  });
};
