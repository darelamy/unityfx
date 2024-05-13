import React, { useState } from "react";
import styles from "./VideoFiles.module.scss";
import { VideoModal } from "@/components/VideoModal";
import { IFile } from "@/types/File";
import { PlayIcon } from "@/icons/PlayIcon";
import { AnimatePresence, motion } from "framer-motion";

export const VideoFiles = ({ files }: { files: IFile[] }) => {
  const [videoUrls, setVideoUrls] = useState<
    { id: string; blobUrl: string; name: string }[]
  >([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<{
    id: string;
    blobUrl: string;
    name: string;
  } | null>(null);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [hoveredVideo, setHoveredVideo] = useState<string | null>(null);

  React.useEffect(() => {
    (async () => {
      const videoFiles = files.filter((file) =>
        file.fileType.startsWith("video"),
      );

      const videoUrls = await Promise.all(
        videoFiles.map(async (file) => {
          const blob = await fetch(file.filePath).then((response) =>
            response.blob(),
          );
          const blobUrl = URL.createObjectURL(blob);
          return { id: file.id, blobUrl, name: file.fileName };
        }),
      );

      setVideoUrls(videoUrls);
    })();
  }, []);

  const handleOpenModal = (video: {
    id: string;
    blobUrl: string;
    name: string;
  }) => {
    setSelectedVideo(video);
    setIsModalOpen(true);

    document.body.style.overflow = "hidden";
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedVideo(null);
    setIsVideoLoaded(false);

    document.body.style.overflow = "auto";
  };

  const handleVideoLoad = () => {
    setIsVideoLoaded(true);
  };

  return (
    <div className="flex flex-wrap gap-5">
      {videoUrls.map((url, index) => (
        <div key={url.id} className={styles.videoFile}>
          <div
            className={`${styles.videoPreviewContainer} relative`}
            onClick={() => handleOpenModal(url)}
            onMouseEnter={() => setHoveredVideo(url.id)}
            onMouseLeave={() => setHoveredVideo(null)}
          >
            <video
              className={styles.videoPreview}
              src={url.blobUrl}
              onLoadedData={handleVideoLoad}
            />
            <AnimatePresence>
              {hoveredVideo === url.id && (
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
              {!isVideoLoaded && selectedVideo?.id === url.id && (
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
            {isModalOpen && selectedVideo?.id === url.id && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3, type: "spring" }}
              >
                <VideoModal
                  video={selectedVideo}
                  handleCloseModal={handleCloseModal}
                  onVideoLoad={handleVideoLoad}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
};
