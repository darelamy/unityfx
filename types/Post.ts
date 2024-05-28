import { IUser } from "@/types/User";
import { IFile } from "@/types/File";
import { IPostLike } from "@/types/PostLike";
import { IView } from "@/types/View";
import { IComment } from "@/types/Comment";
import { ProgramType } from "@/types/Program";
import { OutputBlockData } from "@editorjs/editorjs";

export interface IPost {
  id: string;
  _id: string;
  user: IUser;
  body: OutputBlockData["data"];
  files: IFile[];
  programs: ProgramType[];
  tags: string[];
  likes: IPostLike[];
  views: IView[];
  comments: IComment[];
  createdAt: Date;
  $createdAt: Date;
}
