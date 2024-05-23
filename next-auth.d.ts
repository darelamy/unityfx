import { IUser } from "@/types/User";

declare module "next-auth" {
  interface Session {
    user: {
      token?: string;
    } & IUser;
  }
}
