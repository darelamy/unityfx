import React, { ChangeEvent } from "react";
import styles from "@/components/Post/Post.module.scss";
import { AttachIcon } from "@/icons/AttachIcon";
import { IUploadedFile } from "@/components/FileUploadForm";
import axios from "axios";
import { apiUrl } from "@/src/app/api/apiUrl";

interface AttachPostFileFormProps {
  attachedFiles: IUploadedFile[];
  setAttachedFiles: React.Dispatch<React.SetStateAction<IUploadedFile[]>>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setUploadingFiles: React.Dispatch<React.SetStateAction<Set<string>>>;
  setAttachFilesError: React.Dispatch<React.SetStateAction<string | null>>;
}

export const AttachPostFileForm: React.FC<AttachPostFileFormProps> = ({
  attachedFiles,
  setAttachedFiles,
  setIsLoading,
  setUploadingFiles,
  setAttachFilesError,
}) => {
  const attachFileRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const newFiles = event.target.files;

    if (newFiles) {
      const fileList = Array.from(newFiles);
      const newValidFiles = fileList.filter(
        (file) => attachedFiles.length < 10
      );

      if (fileList.length >= 10) {
        setAttachedFiles(
          [...fileList.slice(0, 10)].map((file) => ({ file, fileUrl: "" }))
        );
        setAttachFilesError("Вы не можете прикрепить больше 10 файлов");
      } else {
        const filesWithUrls = newValidFiles.map((file) => ({
          file,
          fileUrl: "",
        }));
        setAttachedFiles((prevFiles) =>
          [...prevFiles, ...filesWithUrls].slice(0, 10)
        );
        setAttachFilesError(null);

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

  const uploadFiles = async (files: IUploadedFile[]) => {
    try {
      const uploadPromises = files.map(async (fileWithUrl) => {
        const { file } = fileWithUrl;
        const fileName = file.name;

        addToUploadingFiles(fileName);

        const formData = new FormData();
        formData.append("file", file);

        try {
          setIsLoading(true);

          const response = await axios.post(`${apiUrl}/api/upload`, formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });
          const fileUrl = response.data.fileUrl;

          setAttachedFiles((prevFiles) =>
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
    }
  };

  return (
    <div>
      <label
        onClick={() => attachFileRef?.current?.click()}
        className={`${styles.formAttachFileLabel} flex items-center gap-2 cursor-pointer`}
      >
        <AttachIcon />
      </label>
      <input
        className={styles.attachFileInput}
        type="file"
        ref={attachFileRef}
        onChange={handleFileChange}
        accept=".veg, .prproj, .aep, .movprj, .drp, .vpr, .ffx, .aex, .MBLook"
        name="file"
        hidden
        multiple
        disabled={attachedFiles.length > 10}
      />
    </div>
  );
};
