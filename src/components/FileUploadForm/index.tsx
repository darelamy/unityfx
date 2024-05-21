import React, { useState, ChangeEvent, FormEvent } from "react";
import styles from "./FileUploadForm.module.scss";
import { AttachIcon } from "@/icons/AttachIcon";
import { AnimatePresence, motion } from "framer-motion";
import { VideoFileIcon } from "@/icons/VideoFileIcon";
import { VegasProFileIcon } from "@/icons/VegasProFileIcon";
import { PremiereProFileIcon } from "@/icons/PremiereProFileIcon";
import { AfterEffectFileIcon } from "@/icons/AfterEffectFileIcon";
import { MovaviFileIcon } from "@/icons/MovaviFileIcon";
import { DaVinciResolveFileIcon } from "@/icons/DaVinciResolveFileIcon";
import { MinusIcon } from "@/icons/MinusIcon";
import { WarningIcon } from "@/icons/WarningIcon";
import { formatFileSize } from "@/helpers/formatFileSize";
import { cutFileExt } from "@/helpers/cutFileExt";
import { getFileExt } from "@/helpers/getFileExt";

export const iconMapping: { [key: string]: React.ReactNode } = {
  ".mp4": <VideoFileIcon />,
  ".mov": <VideoFileIcon />,
  ".webm": <VideoFileIcon />,
  ".gif": <VideoFileIcon />,
  ".veg": <VegasProFileIcon />,
  ".prproj": <PremiereProFileIcon />,
  ".aep": <AfterEffectFileIcon />,
  ".movprj": <MovaviFileIcon />,
  ".drp": <DaVinciResolveFileIcon />,
  ".vpr": <VegasProFileIcon />,
  ".ffx": <AfterEffectFileIcon />,
};

export const getFileIcon = (filename: string) => {
  const extension = filename.slice(filename.lastIndexOf(".")).toLowerCase();
  return iconMapping[extension];
};

const FileUploadForm: React.FC = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newFiles = event.target.files;

    if (newFiles) {
      const fileList = Array.from(newFiles);
      const newValidFiles = fileList.filter((file) => files.length < 10);

      if (fileList.length >= 10) {
        setFiles([...fileList.slice(0, 10)]);
        setError("Вы не можете прикрепить больше 10 файлов");
      } else {
        setFiles((prevFiles) => [...prevFiles, ...newValidFiles].slice(0, 10));
        setError(null);
      }
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (files.length === 0) {
      alert("Please add files before submitting!");
      return;
    }
    setError(null);
    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));

    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      alert("Files uploaded successfully!");
      setFiles([]);
    } else {
      alert("Failed to upload files.");
    }
  };

  const onRemoveAttachedFile = (attachedFile: File) => {
    setError("");
    setFiles(files.filter((file) => file !== attachedFile));
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label
          htmlFor="attachFile"
          className={`${styles.formAttachFileLabel} flex items-center gap-2`}
          style={{
            pointerEvents: error ? "none" : "all",
          }}
        >
          <AttachIcon />
          <span>Прикрепить файл</span>
        </label>
        <input
          className={styles.attachFileInput}
          type="file"
          id="attachFile"
          onChange={handleFileChange}
          accept=".gif, .mp4, .mov, .webm, .veg, .prproj, .aep, .movprj, .drp, .vpr, .ffx"
          name="file"
          hidden
          multiple
          disabled={files.length > 10}
        />
      </div>
      <div className={`${styles.attachedFiles} flex flex-col`}>
        {error && (
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
                onClick={() => setError("")}
              >
                <div className="flex items-center gap-2">
                  <WarningIcon />
                  <p className={styles.attachedFileErrorText}>{error}</p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        )}
        <AnimatePresence mode="popLayout">
          {files.map((file, index) => (
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
              <button
                className={styles.attachFileRemove}
                type="button"
                onClick={() => onRemoveAttachedFile(file)}
              >
                <MinusIcon />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </form>
  );
};

export default FileUploadForm;
