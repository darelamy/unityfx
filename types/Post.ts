import { IUser } from "@/types/User";
import { IFile } from "@/types/File";
import { IPostLike } from "@/types/PostLike";
import { IView } from "@/types/View";
import { IComment } from "@/types/Comment";
import { ProgramType } from "@/types/Program";

export interface IPost {
  id: string;
  author: IUser;
  body: string;
  files: IFile[];
  programs: ProgramType[];
  tags: string[];
  likes: IPostLike[];
  views: IView[];
  comments: IComment[];
  createdAt: Date;
}
