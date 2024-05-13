import { IUser } from "@/types/User";

export interface IView {
  id: string;
  postId: string;
  author: IUser;
}
