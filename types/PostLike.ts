import { IUser } from "@/types/User";

export interface IPostLike {
  id: string;
  postId: string;
  user: IUser;
  createdAt: string;
}
