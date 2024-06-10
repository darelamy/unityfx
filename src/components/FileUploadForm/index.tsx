"use client";

import React, { ChangeEvent } from "react";
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
import { BeatLoader } from "react-spinners";
import { Dropbox } from "dropbox";

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
  ".aex": <AfterEffectFileIcon />,
};

export const getFileIcon = (filename: string) => {
  const extension = filename.slice(filename.lastIndexOf(".")).toLowerCase();
  return iconMapping[extension];
};

export interface IUploadedFile {
  file: File;
  fileUrl: string;
}

interface FileUploadFormProps {
  files: IUploadedFile[];
  setFiles: React.Dispatch<React.SetStateAction<IUploadedFile[]>>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export const FileUploadForm: React.FC<FileUploadFormProps> = ({
  files,
  setFiles,
  setIsLoading,
}) => {
  const [error, setError] = React.useState<string | null>(null);
  const [uploadingFiles, setUploadingFiles] = React.useState<Set<string>>(
    new Set()
  );

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const newFiles = event.target.files;

    if (newFiles) {
      const fileList = Array.from(newFiles);
      const newValidFiles = fileList.filter((file) => files.length < 10);

      if (fileList.length >= 10) {
        setFiles(
          [...fileList.slice(0, 10)].map((file) => ({ file, fileUrl: "" }))
        );
        setError("Вы не можете прикрепить больше 10 файлов");
      } else {
        const filesWithUrls = newValidFiles.map((file) => ({
          file,
          fileUrl: "",
        }));
        setFiles((prevFiles) => [...prevFiles, ...filesWithUrls].slice(0, 10));
        setError(null);

        await uploadFiles(filesWithUrls);
      }
    }
  };

  const addToUploadingFiles = (fileName: string) => {
    setUploadingFiles((prevState) => new Set(prevState.add(fileName)));
  };

  const removeFromUploadingFiles = (fileName: string) => {
    setUploadingFiles((prevState) => {
      const newState = new Set(prevState);
      newState.delete(fileName);

      return newState;
    });
  };

  const isUploading = (fileName: string) => uploadingFiles.has(fileName);

  const uploadFiles = async (files: IUploadedFile[]) => {
    try {
      const dbx = new Dropbox({
        accessToken: process.env.NEXT_PUBLIC_DROPBOX_ACCESS_TOKEN,
      });

      const uploadPromises = files.map(async (fileWithUrl) => {
        const { file } = fileWithUrl;
        const fileName = file.name;

        addToUploadingFiles(fileName);

        try {
          setIsLoading(true);

          const arrayBuffer = await file.arrayBuffer();
          const uint8Array = new Uint8Array(arrayBuffer);

          const result = await dbx.filesUpload({
            path: "/" + file.name,
            contents: uint8Array,
            mode: { ".tag": "add" },
            autorename: true,
            mute: false,
          });

          const sharedLinkResponse =
            await dbx.sharingCreateSharedLinkWithSettings({
              path: result.result.path_lower,
            });

          const fileUrl = sharedLinkResponse.result.url.replace(
            "www.dropbox.com",
            "dl.dropbox.com"
          );

          setFiles((prevFiles) =>
            prevFiles.map((f) =>
              f.file.name === fileName ? { ...f, fileUrl: fileUrl } : f
            )
          );
        } finally {
          removeFromUploadingFiles(fileName);
          setIsLoading(false);
        }
      });

      await Promise.all(uploadPromises);
    } catch (err) {
      console.error(err);
      setError("Ошибка при загрузке файла на Dropbox");
      setIsLoading(false);
    }
  };

  const onRemoveAttachedFile = async (attachedFile: File) => {
    const dbx = new Dropbox({
      fetch: fetch,
      accessToken: process.env.NEXT_PUBLIC_DROPBOX_ACCESS_TOKEN,
    });

    setFiles(files.filter((file) => file.file !== attachedFile));

    try {
      await dbx.filesDeleteV2({ path: "/" + attachedFile.name });
    } catch (err) {
      console.error(err);
      setError("Ошибка при удалении файла с Dropbox");
    }
  };

  return (
    <div>
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
          accept=".gif, .mp4, .mov, .webm, .veg, .prproj, .aep, .movprj, .drp, .vpr, .ffx, .aex, .MBLook"
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
          {files.map(({ file }, index) => (
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
        </AnimatePresence>
      </div>
    </div>
  );
};
