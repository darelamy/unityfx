import { IUser } from "@/types/User";

export interface IView {
  id: string;
  postId: string;
  userId: string;
  author: IUser;
  createdAt: Date;
}
