"use client";

import styles from "./Post.module.scss";
import { IPost } from "@/types/Post";
import { DefaultAvatar } from "@/ui/DefaultAvatar";
import { formatDate } from "@/helpers/formatDate";
import React from "react";
import { VideoFiles } from "@/components/VideoFiles";
import { EditingProgramFiles } from "@/components/EditingProgramFiles";
import { programsList } from "@/components/ProgramSelector";
import { LikeIcon } from "@/icons/LikeIcon";
import { ViewIcon } from "@/icons/ViewIcon";
import { ArrowDownIcon } from "@/icons/ArrowDownIcon";
import { CommentItem } from "@/components/CommentItem";
import { OutputBlockData } from "@editorjs/editorjs";
import { useInView } from "react-intersection-observer";
import { IUser } from "@/types/User";
import axios from "axios";
import { apiUrl } from "@/src/app/api/apiUrl";
import Link from "next/link";
import { SendIcon } from "@/icons/SendIcon";
import { IComment } from "@/types/Comment";
import { CrossIcon } from "@/icons/CrossIcon";
import { getFileIcon, IUploadedFile } from "@/components/FileUploadForm";
import { AttachPostFileForm } from "@/components/AttachPostFileForm";
import { AnimatePresence, motion } from "framer-motion";
import { cutFileExt } from "@/helpers/cutFileExt";
import { getFileExt } from "@/helpers/getFileExt";
import { formatFileSize } from "@/helpers/formatFileSize";
import { BeatLoader } from "react-spinners";
import { MinusIcon } from "@/icons/MinusIcon";
import { WarningIcon } from "@/icons/WarningIcon";

interface PostProps extends IPost {
  authUser?: IUser;
  isPostLiked: boolean;
  onDeletePost?: (postId: string) => void;
}

export const Post: React.FC<PostProps> = ({
  id,
  body,
  user,
  createdAt,
  likes,
  files,
  tags,
  views,
  programs,
  comments,
  authUser,
  isPostLiked,
  onDeletePost,
}) => {
  const [commentText, setCommentText] = React.useState("");
  const [viewsCount, setViewsCount] = React.useState(views?.length);
  const [isView, setIsView] = React.useState(false);
  const [isLiked, setIsLiked] = React.useState(isPostLiked);
  const [likesCount, setLikesCount] = React.useState(likes?.length);
  const [likeId, setLikeId] = React.useState<string>(
    likes.find((like) => like?.user?.id === authUser?.id)?.id || ""
  );
  const [localComments, setLocalComments] = React.useState<IComment[]>(
    comments || []
  );
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isLikeSubmitting, setIsLikeSubmitting] = React.useState(false);
  const [showAllComments, setShowAllComments] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [attachedFiles, setAttachedFiles] = React.useState<IUploadedFile[]>([]);
  const [uploadingFiles, setUploadingFiles] = React.useState<Set<string>>(
    new Set()
  );
  const [attachFilesError, setAttachFilesError] = React.useState<string | null>(
    null
  );

  const inputRef = React.useRef<HTMLInputElement>(null);

  const isAuth = !!authUser;

  const { ref, inView } = useInView({
    threshold: 1,
    triggerOnce: true,
  });

  const isUploading = (fileName: string) => uploadingFiles.has(fileName);

  const toggleLike = async () => {
    try {
      if (!isLiked) {
        setIsLikeSubmitting(true);

        setIsLiked(true);
        setLikesCount(likesCount + 1);

        const { data } = await axios.post(`${apiUrl}/api/posts/${id}/likes`);

        setLikeId(data.like.id);
      } else {
        setIsLiked(false);
        setLikesCount(likesCount - 1);

        await axios.delete(`${apiUrl}/api/posts/${id}/likes/${likeId}`);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLikeSubmitting(false);
    }
  };

  const onSubmitComment = async () => {
    try {
      setIsSubmitting(true);

      const { data } = await axios.post(`${apiUrl}/api/posts/${id}/comments`, {
        text: commentText,
        files: attachedFiles.map((file) => ({
          fileName: file.file.name,
          fileUrl: file.fileUrl,
          fileType: file.file.type,
        })),
      });

      setLocalComments([...localComments, data.comment]);
      setCommentText("");
      setAttachedFiles([]);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const deletePost = async () => {
    try {
      await axios.delete(`${apiUrl}/api/posts/${id}`);
      if (onDeletePost) {
        onDeletePost(id);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const onRemoveAttachedFile = async (attachFile: File) => {
    const formData = new FormData();
    formData.append("file", attachFile);

    setAttachedFiles(attachedFiles.filter((file) => file.file !== attachFile));

    await axios.delete(`${apiUrl}/api/upload`, { data: formData });
  };

  React.useEffect(() => {
    (async () => {
      try {
        if (
          (inView &&
            isAuth &&
            !isView &&
            !views.find((view) => view.userId === authUser?.id)) ||
          (inView && views.length === 0)
        ) {
          await setIsView(true);

          setViewsCount(views.length + 1);

          await axios.post(`${apiUrl}/api/posts/${id}/views`);
        }
      } catch (err) {
        console.error(err);
      }
    })();
  }, [inView]);

  return (
    <div className={styles.content}>
      <div
        className={`${styles.top} flex items-center justify-between flex-wrap gap-2`}
      >
        <Link href={`/@${user?.login}`} className="flex items-center">
          <div className={styles.avatar}>
            {user?.avatarUrl ? (
              <img src={user.avatarUrl} alt="avatar" />
            ) : (
              <DefaultAvatar />
            )}
          </div>
          <span className={styles.login}>{user?.login}</span>
        </Link>
        <div className="flex items-center">
          <span className={styles.createdAt}>{formatDate(createdAt)}</span>
          {isAuth && authUser?.id === user.id && (
            <button onClick={deletePost} className={styles.deleteButton}>
              <CrossIcon />
            </button>
          )}
        </div>
      </div>
      <div className={styles.body}>
        {body?.map((obj: OutputBlockData["data"]) => (
          <p key={obj?.id} className={styles.text}>
            {obj.data.text}
          </p>
        ))}
      </div>
      <VideoFiles
        files={files?.filter((file) => file.fileType.startsWith("video"))}
      />
      <EditingProgramFiles
        files={files?.filter((file) => !file.fileType.startsWith("video"))}
      />
      {programs.length !== 0 && (
        <div className={styles.programsBlock}>
          <p className={styles.programsBlockTitle}>Использованные программы</p>
          <div className={`${styles.programs} flex`}>
            {programs.map((program) => {
              const programInfo = programsList.find(
                (item) => item.name.toLowerCase() === program.toLowerCase()
              );
              return programInfo ? (
                <div key={programInfo.id}>{programInfo.icon}</div>
              ) : null;
            })}
          </div>
        </div>
      )}
      <div className="flex items-center justify-between">
        <div className={`${styles.tags} flex flex-wrap gap-2`}>
          {tags.map((tag) => (
            <span key={tag} className={styles.tag}>
              #{tag}
            </span>
          ))}
        </div>
        <div className="flex items-center gap-5" ref={ref}>
          <LikeIcon
            isLikeSubmitting={isLikeSubmitting}
            likeId={likeId}
            likesCount={likesCount}
            isLiked={isLiked}
            handleClick={toggleLike}
            isAuth={isAuth}
          />
          <ViewIcon viewsCount={viewsCount} />
        </div>
      </div>
      <div>
        {localComments && (
          <>
            <div
              className={`${styles.commentsBlockTop} flex items-center gap-6`}
            >
              <p className={styles.commentsBlockTitle}>Комментарии</p>
              {localComments.length > 1 && (
                <button
                  className={`${styles.commentsShowAllBtn} flex items-center gap-2`}
                  onClick={() => setShowAllComments(!showAllComments)}
                >
                  <ArrowDownIcon />
                  <span>{showAllComments ? "Скрыть" : "Показать все"}</span>
                </button>
              )}
            </div>
            <div className="flex flex-col gap-5">
              {(showAllComments
                ? localComments
                : localComments.slice(0, 1)
              ).map((comment) => (
                <div
                  key={comment.id}
                  style={{
                    borderBottom:
                      localComments[localComments.length - 1].id !==
                        comment.id && showAllComments
                        ? "0.5px solid rgb(227, 226, 226)"
                        : "none",
                    paddingBottom: 10,
                  }}
                >
                  <CommentItem
                    setLocalComments={setLocalComments}
                    key={comment.id}
                    {...comment}
                    authUser={authUser}
                    isCommentLiked={comment?.likes?.some(
                      (like) => like?.user?.id === authUser?.id
                    )}
                    postId={comment?.post?.id}
                  />
                </div>
              ))}
            </div>
          </>
        )}
        {isAuth && (
          <div className={styles.commentsBlockInput}>
            <div>
              <div className="flex justify-between">
                <div className={`${styles.commentInputBlock} relative`}>
                  <div className={styles.attachButton}>
                    <AttachPostFileForm
                      setAttachedFiles={setAttachedFiles}
                      setIsLoading={setIsLoading}
                      attachedFiles={attachedFiles}
                      setUploadingFiles={setUploadingFiles}
                      setAttachFilesError={setAttachFilesError}
                    />
                  </div>
                  <input
                    ref={inputRef}
                    type="text"
                    className={styles.commentInput}
                    placeholder="Напишите комментарий"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        onSubmitComment();
                      }
                    }}
                  />
                </div>
                <button
                  className={styles.commentSendBtn}
                  disabled={!commentText || isSubmitting || isLoading}
                  onClick={onSubmitComment}
                >
                  <span>Отправить</span>
                  <SendIcon />
                </button>
              </div>
              {attachFilesError && (
                <AnimatePresence mode="popLayout">
                  <motion.div
                    layout
                    initial={{ opacity: 0, x: -400, scale: 0.5 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: 200, scale: 1.2 }}
                    transition={{ duration: 0.6, type: "spring" }}
                  >
                    <div
                      className={`${styles.attachedFilesError} flex items-center justify-center`}
                      onClick={() => setAttachFilesError("")}
                    >
                      <div className="flex items-center gap-2">
                        <WarningIcon />
                        <p className={styles.attachedFileErrorText}>
                          {attachFilesError}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              )}
              {attachedFiles.length !== 0 && (
                <AnimatePresence mode="popLayout">
                  <div className="flex flex-col gap-4 mt-5">
                    {attachedFiles.map(({ file }, index) => (
                      <motion.div
                        className={`${styles.attachedFile} flex items-center justify-between`}
                        key={index}
                        layout
                        initial={{ opacity: 0, x: -400, scale: 0.5 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: 200, scale: 1.2 }}
                        transition={{ duration: 0.6, type: "spring" }}
                      >
                        <div className="flex items-center">
                          {getFileIcon(file.name)}
                          <div className="flex flex-col">
                            <div className="flex">
                              <p className={styles.attachedFileName}>
                                {cutFileExt(file.name)}
                              </p>
                              <span>.{getFileExt(file.name)}</span>
                            </div>
                            <p className={styles.attachedFileSize}>
                              {formatFileSize(file.size)}
                            </p>
                          </div>
                        </div>
                        <motion.div
                          className="flex items-center gap-2"
                          layout
                          initial={{ opacity: 0, x: -400, scale: 0.5 }}
                          animate={{ opacity: 1, x: 0, scale: 1 }}
                          exit={{ opacity: 0, x: 200, scale: 1.2 }}
                          transition={{ duration: 0.6, type: "spring" }}
                        >
                          {isUploading(file.name) && (
                            <BeatLoader color="#FFBE2E" size={10} />
                          )}
                          <button
                            className={styles.attachFileRemove}
                            type="button"
                            onClick={() => onRemoveAttachedFile(file)}
                            disabled={isUploading(file.name)}
                          >
                            <MinusIcon />
                          </button>
                        </motion.div>
                      </motion.div>
                    ))}
                  </div>
                </AnimatePresence>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
