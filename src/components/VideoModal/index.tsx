import React from "react";
import styles from "./VideoModal.module.scss";
import { CrossIcon } from "@/icons/CrossIcon";

export const VideoModal = ({
  video,
  handleCloseModal,
}: {
  video: { blobUrl: string; name: string };
  handleCloseModal: () => void;
}) => {
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <video controls className={styles.video} src={video.blobUrl}>
          Ваш браузер не поддерживает тег video
        </video>
        <div className={styles.videoName}>{video.name}</div>
        <button className={styles.closeButton} onClick={handleCloseModal}>
          <CrossIcon />
        </button>
      </div>
    </div>
  );
};
