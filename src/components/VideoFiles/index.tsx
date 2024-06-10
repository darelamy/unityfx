import React from "react";
import styles from "./VideoFiles.module.scss";
import { VideoModal } from "@/components/VideoModal";
import { IFile } from "@/types/File";
import { PlayIcon } from "@/icons/PlayIcon";
import { AnimatePresence, motion } from "framer-motion";

export const VideoFiles = ({ files }: { files: IFile[] }) => {
  const [selectedVideo, setSelectedVideo] = React.useState<{
    id: string;
    blobUrl: string;
    name: string;
  } | null>(null);
  const [hoveredVideo, setHoveredVideo] = React.useState<string | null>(null);
  const [isVideoLoaded, setIsVideoLoaded] = React.useState(false);

  const videoRef = React.useRef<HTMLVideoElement>(null);

  const handleOpenModal = (video: {
    id: string;
    blobUrl: string;
    name: string;
  }) => {
    setSelectedVideo(video);
  };

  const handleCloseModal = () => {
    setSelectedVideo(null);
  };

  const handleVideoLoad = () => setIsVideoLoaded(true);

  return (
    <div className="flex flex-wrap gap-5">
      {files.map((file, index) => (
        <div key={index} className={styles.videoFile}>
          <div
            className={`${styles.videoPreviewContainer} relative`}
            onClick={() =>
              handleOpenModal({
                id: file.id,
                blobUrl: file.fileUrl,
                name: file.fileName,
              })
            }
            onMouseEnter={() => setHoveredVideo(file.id)}
            onMouseLeave={() => setHoveredVideo(null)}
          >
            <video
              ref={videoRef}
              className={styles.videoPreview}
              src={file.fileUrl}
              onLoadedData={handleVideoLoad}
              onLoadedMetadata={(e) => {
                const video = e.currentTarget;
                video.currentTime = video.duration / 2;
              }}
            />
            <AnimatePresence>
              {hoveredVideo === file.id && (
                <motion.div
                  className={`${styles.previewBg} absolute flex items-center justify-center`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.8 }}
                  exit={{ opacity: 0 }}
                >
                  <motion.div
                    className="flex items-center justify-center"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, type: "spring" }}
                  >
                    <PlayIcon />
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
            <AnimatePresence>
              {!isVideoLoaded && selectedVideo?.id === file.id && (
                <motion.div
                  className={`${styles.loadingOverlay} absolute flex items-center justify-center`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3, type: "spring" }}
                >
                  <p>Загрузка...</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <AnimatePresence>
            {selectedVideo && (
              <motion.div
                className={styles.modalOverlay}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <VideoModal
                  video={selectedVideo}
                  handleCloseModal={handleCloseModal}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
};
