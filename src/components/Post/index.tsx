"use client";

import styles from "./Post.module.scss";
import { IPost } from "@/types/Post";
import { DefaultAvatar } from "@/ui/DefaultAvatar";
import { formatDate } from "@/helpers/formatDate";
import React, { useState } from "react";
import { blob } from "node:stream/consumers";
import { CrossIcon } from "@/icons/CrossIcon";

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
  const [isModalOpen, setIsModalOpen] = useState(false);

  const VideoModal = ({ video, handleCloseModal }) => {
    return (
      <div className={styles.modalOverlay} onClick={handleCloseModal}>
        <div className={styles.modalContent}>
          <video controls className={styles.video}>
            <source src={video} />
            Your browser does not support the video tag.
          </video>
          <button className={styles.closeButton} onClick={handleCloseModal}>
            <CrossIcon />
          </button>
        </div>
      </div>
    );
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const renderVideoFiles = () => {
    const [videoUrls, setVideoUrls] = useState([]);

    React.useEffect(() => {
      const fetchVideos = () => {
        files.forEach((file) => {
          if (file.fileType.startsWith("video")) {
            fetch(file.filePath)
              .then((response) => response.blob())
              .then((blob) => {
                const blobUrl = URL.createObjectURL(blob);
                setVideoUrls([blobUrl]);
              });
          }
        });
      };

      fetchVideos();
    }, []);
    console.log(videoUrls);
    return (
      <div>
        {videoUrls.map((url, index) => (
          <div key={index}>
            <video
              className={styles.videoPreview}
              onClick={() => handleOpenModal()}
            >
              <source src={url} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            {isModalOpen && (
              <VideoModal video={url} handleCloseModal={handleCloseModal} />
            )}
          </div>
        ))}
      </div>
    );
  };

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
      <div className={styles.videos}>{renderVideoFiles()}</div>
      <div></div>
      <div></div>
    </div>
  );
};
