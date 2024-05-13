import React, { useState, useEffect } from "react";
import styles from "./VideoModal.module.scss";
import { CrossIcon } from "@/icons/CrossIcon";

export const VideoModal = ({
  video,
  handleCloseModal,
  onVideoLoad,
}: {
  video: { blobUrl: string; name: string };
  handleCloseModal: () => void;
  onVideoLoad: () => void;
}) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
  }, []);

  const handleVideoLoad = () => {
    setIsLoading(false);
    onVideoLoad();
  };

  return (
    <div className={styles.modalOverlay} onClick={handleCloseModal}>
      <div className={styles.modalContent}>
        <video
          style={{ display: isLoading ? "none" : "block" }}
          controls
          className={styles.video}
          src={video.blobUrl}
          onLoadedData={handleVideoLoad}
        >
          Ваш браузер не поддерживает тег video
        </video>
        {isLoading && <div className={styles.loadingText}>Загрузка...</div>}
        {!isLoading && (
          <div className="flex items-center justify-between">
            <p className={styles.videoName}>{video.name}</p>
            <button className={styles.closeButton} onClick={handleCloseModal}>
              <CrossIcon />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
