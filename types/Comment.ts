import { IUser } from "@/types/User";
import { ICommentLike } from "@/types/CommentLike";
import { IPost } from "@/types/Post";
import { IFile } from "@/types/File";

export interface IComment {
  id: string;
  user: IUser;
  text: string;
  likes: ICommentLike[];
  files: IFile[];
  post: IPost;
  createdAt: Date;
}
