import styles from "./CommentItem.module.scss";
import { IComment } from "@/types/Comment";
import { DefaultAvatar } from "@/ui/DefaultAvatar";
import { formatDate } from "@/helpers/formatDate";
import { LikeIcon } from "@/icons/LikeIcon";
import React from "react";
import { IUser } from "@/types/User";
import axios from "axios";
import { apiUrl } from "@/src/app/api/apiUrl";
import { CrossIcon } from "@/icons/CrossIcon";
import { EditingProgramFiles } from "@/components/EditingProgramFiles";

interface CommentItemProps extends IComment {
  authUser?: IUser;
  isCommentLiked?: boolean;
  postId?: string;
  setLocalComments?: React.Dispatch<React.SetStateAction<IComment[]>>;
}

export const CommentItem: React.FC<CommentItemProps> = ({
  id,
  user,
  text,
  likes,
  createdAt,
  authUser,
  isCommentLiked,
  postId,
  setLocalComments,
  files,
}) => {
  const [isLiked, setIsLiked] = React.useState(isCommentLiked);
  const [likeId, setLikeId] = React.useState<string>(
    likes?.find((like) => like?.user?.id === authUser?.id)?.id || ""
  );
  const [likesCount, setLikesCount] = React.useState(likes?.length || 0);

  const isAuth = !!authUser;

  const toggleLike = async () => {
    try {
      if (!isLiked) {
        setIsLiked(true);
        setLikesCount(likesCount + 1);

        const { data } = await axios.post(
          `${apiUrl}/api/comments/${id}/likes`,
          {
            postId,
          }
        );

        setLikeId(data.like.id);
      } else {
        setIsLiked(false);
        setLikesCount(likesCount - 1);

        await axios.delete(`${apiUrl}/api/comments/${id}/likes/${likeId}`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const deleteComment = async () => {
    try {
      await axios.delete(`${apiUrl}/api/comments/${id}`);

      if (setLocalComments)
        setLocalComments((prevComments) =>
          prevComments.filter((comment) => comment.id !== id)
        );
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className={styles.commentItem}>
      <div className="flex items-center">
        <div className={styles.avatar}>
          {user?.avatarUrl ? (
            <img src={user.avatarUrl} alt="avatar" />
          ) : (
            <DefaultAvatar />
          )}
        </div>
        <div className="flex flex-col">
          <span className={styles.login}>{user?.login}</span>
          <span className={styles.createdAt}>{formatDate(createdAt)}</span>
        </div>
      </div>
      <p className={styles.text}>{text}</p>
      <EditingProgramFiles
        files={files?.filter((file) => !file.fileType.startsWith("video"))}
      />
      <div className="flex items-center justify-end gap-2">
        {isAuth && authUser?.id === user?.id && (
          <button onClick={deleteComment} className={styles.deleteButton}>
            <CrossIcon />
          </button>
        )}
        <LikeIcon
          likeId={likeId}
          likesCount={likesCount}
          isLiked={isLiked}
          handleClick={toggleLike}
          isAuth={isAuth}
        />
      </div>
    </div>
  );
};
