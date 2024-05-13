import styles from "./CommentItem.module.scss";
import { IComment } from "@/types/Comment";
import { DefaultAvatar } from "@/ui/DefaultAvatar";
import { formatDate } from "@/helpers/formatDate";
import { LikeIcon } from "@/icons/LikeIcon";

interface CommentItemProps extends IComment {}

export const CommentItem: React.FC<CommentItemProps> = ({
  id,
  author,
  text,
  likes,
  createdAt,
}) => {
  return (
    <div>
      <div className="flex items-center">
        <div className={styles.avatar}>
          {author.avatarUrl ? (
            <img src={author.avatarUrl} alt="avatar" />
          ) : (
            <DefaultAvatar />
          )}
        </div>
        <div className="flex flex-col">
          <span className={styles.login}>{author.login}</span>
          <span className={styles.createdAt}>{formatDate(createdAt)}</span>
        </div>
      </div>
      <p className={styles.text}>
        👏 Просто потрясающе! Я восхищен вашим творчеством и мастерством. Этот
        переход выглядит так естественно и плавно, словно каждый кадр танцует с
        другим. Вы действительно создали что-то волшебное! 💫 Жду с нетерпением,
        чтобы увидеть больше ваших работ!
      </p>
      <div className="flex items-center justify-between">
        <button className={styles.replyBtn}>Ответить</button>
        <LikeIcon isLiked={true} likesCount={100} />
      </div>
    </div>
  );
};
