import { IUser } from "@/types/User";
import { ICommentLike } from "@/types/CommentLike";

export interface IComment {
  id: string;
  author: IUser;
  createdAt: Date;
  text: string;
  likes: ICommentLike[];
}
