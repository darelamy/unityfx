import { PrismaAdapter } from "@next-auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import prismadb from "@/lib/prisma/prismadb";
import * as bcrypt from "bcrypt";
import { getServerSession, NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prismadb),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        // email: { label: "email", type: "text", placeholder: "email" },
        login: { label: "Login", type: "text", placeholder: "login" },
        password: {
          label: "Password",
          type: "password",
          placeholder: "password",
        },
      },
      async authorize(credentials) {
        if (!credentials || !credentials.login || !credentials.password)
          return null;

        const user = await prismadb.user.findUnique({
          where: {
            login: credentials.login,
          },
          select: {
            id: true,
            login: true,
            passwordHash: true,
            desc: true,
            avatarUrl: true,
          },
        });

        if (!user?.passwordHash) throw new Error("Неверный логин или пароль");

        const isCorrectPassword = await bcrypt.compare(
          credentials.password,
          user.passwordHash
        );

        if (!isCorrectPassword) throw new Error("Неверный логин или пароль");

        return {
          id: user.id,
          login: user.login,
          desc: user.desc,
          avatarUrl: user.avatarUrl,
        };
      },
    }),
  ],
  callbacks: {
    jwt: async ({ token, user, trigger, session }) => {
      if (trigger === "update" && session.avatarUrl)
        token.avatarUrl = session.avatarUrl;

      if (trigger === "update" && (session.login || session.desc)) {
        token.login = session.login;
        token.desc = session.desc;
      }

      return { ...token, ...user };
    },
    session: async ({ session, token }) => {
      session.user = token as any;

      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  debug: true,
  session: {
    strategy: "jwt",
  },
  secret: process.env.JWT_SECRET,
} satisfies NextAuthOptions;

export const auth = () => getServerSession(authOptions);

export default authOptions;
