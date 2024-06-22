import * as bcrypt from "bcrypt";
import { randomBytes } from "crypto";

import prismadb from "@/lib/prisma/prismadb";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

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
  const confirmationCode = randomBytes(3).toString("hex");
  const tempToken = randomBytes(16).toString("hex");

  await prismadb.tempUser.deleteMany({
    where: {
      email,
    },
  });

  const tempUser = await prismadb.tempUser.create({
    data: {
      login,
      email,
      passwordHash,
      confirmationCode,
      tempToken,
    },
  });

  const transporter = nodemailer.createTransport({
    service: "Gmail",
    host: "smtp.gmail.com",
    port: 995,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
    tls: {
      rejectUnauthorized: true,
    },
  });

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Завершение регистрации",
    html: `<!DOCTYPE html>
      <html lang="ru">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Завершение регистрации</title>
        <style>
          body {
            margin: 0;
            padding: 0;
            font-family: Arial, sans-serif;
            background-color: #f9f9f9;
          }
      
          .container {
            max-width: 600px;
            margin: 20px auto;
            padding: 20px;
            background-color: #fff;
            border-radius: 10px;
            box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
          }
      
          .header {
            text-align: center;
            margin-bottom: 30px;
          }
      
          .header h1 {
            color: #333;
          }
      
          .content {
            padding: 0 20px;
          }
      
          .code {
            margin-top: 30px;
            padding: 20px;
            background-color: #f2f2f2;
            border-radius: 5px;
            font-size: 24px;
            text-align: center;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            color:#555D60;
          }
      
          .footer {
            margin-top: 30px;
            text-align: center;
          }
      
          .footer p {
            color: #777;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Завершение регистрации</h1>
          </div>
          <div class="content">
            <p>Здравствуйте!</p>
            <p>Для завершения регистрации на нашем сайте вам необходимо ввести следующий код подтверждения:</p>
            <div class="code">${confirmationCode}</div>
          </div>
          <div class="footer">
            <p>С уважением,<br>Команда Unity FX</p>
          </div>
        </div>
      </body>
      </html>
    `,
  });

  return NextResponse.json(tempUser);
};
