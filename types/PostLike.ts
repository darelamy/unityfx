import { IUser } from "@/types/User";

export interface IPostLike {
  id: string;
  postId: string;
  author: IUser;
}
