import React from "react";
import styles from "./VideoFiles.module.scss";
import { VideoModal } from "@/components/VideoModal";
import { IFile } from "@/types/File";
import { PlayIcon } from "@/icons/PlayIcon";
import { AnimatePresence, motion } from "framer-motion";
import axios from "axios";
import { BarLoader } from "react-spinners";

export const VideoFiles = ({ files }: { files: IFile[] }) => {
  const [videoUrls, setVideoUrls] = React.useState<
    { id: string; blobUrl: string; name: string }[]
  >([]);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [selectedVideo, setSelectedVideo] = React.useState<{
    id: string;
    blobUrl: string;
    name: string;
  } | null>(null);
  const [isVideoLoaded, setIsVideoLoaded] = React.useState(false);
  const [hoveredVideo, setHoveredVideo] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);

  const videoRef = React.useRef<HTMLVideoElement>(null);

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

  const handleVideoLoad = () => setIsVideoLoaded(true);

  React.useEffect(() => {
    (async () => {
      if (files) {
        setIsLoading(true);

        const videoUrls = await Promise.all(
          files.map(async (file) => {
            const response = await axios.get(file.fileUrl, {
              responseType: "blob",
            });
            const blob = response.data;
            const blobUrl = URL.createObjectURL(blob);

            return { id: file.id, blobUrl, name: file.fileName };
          })
        );
        setVideoUrls(videoUrls);

        setIsLoading(false);
      }
    })();
  }, []);

  return isLoading ? (
    <div className="flex my-5 items-center gap-5">
      <span className="font-bold text-2xl text-orange-300">
        Загрузка видео...
      </span>
      <BarLoader color="#FFBE2E" />
    </div>
  ) : (
    videoUrls.length !== 0 && (
      <div className="flex flex-wrap gap-5">
        {videoUrls.map((url, index) => (
          <div key={index} className={styles.videoFile}>
            <div
              className={`${styles.videoPreviewContainer} relative`}
              onClick={() => handleOpenModal(url)}
              onMouseEnter={() => setHoveredVideo(url.id)}
              onMouseLeave={() => setHoveredVideo(null)}
            >
              <video
                ref={videoRef}
                className={styles.videoPreview}
                src={url.blobUrl}
                onLoadedData={handleVideoLoad}
                onLoadedMetadata={(e) => {
                  const video = e.currentTarget;
                  video.currentTime = video.duration / 2;
                }}
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
            <AnimatePresence mode="popLayout">
              {isModalOpen && selectedVideo?.id === url.id && (
                <motion.div
                  layout
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
    )
  );
};
