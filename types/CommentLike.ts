import { IUser } from "@/types/User";

export interface ICommentLike {
  id: string;
  postId: string;
  commentId: string;
  author: IUser;
}
