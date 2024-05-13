"use client";

import styles from "./Post.module.scss";
import { IPost } from "@/types/Post";
import { DefaultAvatar } from "@/ui/DefaultAvatar";
import { formatDate } from "@/helpers/formatDate";
import React, { useState } from "react";
import { VideoFiles } from "@/components/VideoFiles";
import { EditingProgramFiles } from "@/components/EditingProgramFiles";
import { programsList } from "@/components/ProgramSelector";
import { tag } from "postcss-selector-parser";
import { LikeIcon } from "@/icons/LikeIcon";
import { ViewIcon } from "@/icons/ViewIcon";
import { ArrowDownIcon } from "@/icons/ArrowDownIcon";
import { CommentItem } from "@/components/CommentItem";
import { AttachIcon } from "@/icons/AttachIcon";

interface PostProps extends IPost {
  body: string;
}

export const Post: React.FC<PostProps> = ({
  id,
  body,
  author,
  createdAt,
  likes,
  files,
  tags,
  views,
  programs,
  comments,
}) => {
  const [commentText, setCommentText] = React.useState("");

  return (
    <div className={styles.content}>
      <div className={`${styles.top} flex items-center justify-between`}>
        <div className="flex items-center">
          <div className={styles.avatar}>
            {author.avatarUrl ? (
              <img src={author.avatarUrl} alt="avatar" />
            ) : (
              <DefaultAvatar />
            )}
          </div>
          <span className={styles.login}>{author.login}</span>
        </div>
        <span className={styles.createdAt}>{formatDate(createdAt)}</span>
      </div>
      <div className={styles.body}>{body}</div>
      <VideoFiles files={files} />
      <EditingProgramFiles
        files={files.filter((file) => !file.fileType.startsWith("video"))}
      />
      <div className={styles.programsBlock}>
        <p className={styles.programsBlockTitle}>Использованные программы</p>
        <div className={`${styles.programs} flex`}>
          {programs.map((program) => {
            const programInfo = programsList.find(
              (item) => item.name.toLowerCase() === program,
            );
            return programInfo ? (
              <div key={programInfo.id}>{programInfo.icon}</div>
            ) : null;
          })}
        </div>
      </div>
      <div className="flex items-center justify-between">
        <div className={`${styles.tags} flex`}>
          {tags.map((tag) => (
            <span className={styles.tag}>#{tag}</span>
          ))}
        </div>
        <div className="flex items-center gap-5">
          <LikeIcon likesCount={2024} isLiked={false} />
          <ViewIcon viewsCount={2024} />
        </div>
      </div>
      <div>
        <div className={`${styles.commentsBlockTop} flex items-center gap-6`}>
          <p className={styles.commentsBlockTitle}>Комментарии</p>
          <button
            className={`${styles.commentsShowAllBtn} flex items-center gap-2`}
          >
            <ArrowDownIcon />
            <span>Показать все</span>
          </button>
        </div>
        <div className="flex flex-col gap-5">
          {comments.map((comment) => (
            <div
              style={{
                borderBottom:
                  comments.at(-1).id !== comment.id
                    ? "0.5px solid rgb(227, 226, 226)"
                    : "none",
                paddingBottom: 10,
              }}
            >
              <CommentItem key={comment.id} {...comment} />
            </div>
          ))}
        </div>
        <div className={styles.commentsBlockInput}>
          <form action="">
            <div className="flex justify-between">
              <div className={`${styles.commentInputBlock} relative`}>
                <div className={styles.attachButton}>
                  <AttachIcon />
                </div>
                <input
                  type="text"
                  className={styles.commentInput}
                  placeholder="Напишите комментарий"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                />
              </div>
              <button className={styles.commentSendBtn} disabled={!commentText}>
                Отправить
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
