import React from "react";
import styles from "./EditingProgramFiles.module.scss";
import { IFile } from "@/types/File";
import { getFileIcon } from "@/components/FileUploadForm";
import { formatFileSize } from "@/helpers/formatFileSize";
import { getFileExt } from "@/helpers/getFileExt";
import { cutFileExt } from "@/helpers/cutFileExt";

interface EditingProgramFilesProps {
  files: IFile[];
}

export const EditingProgramFiles: React.FC<EditingProgramFilesProps> = ({
  files,
}) => {
  const [formattedFiles, setFormattedFiles] = React.useState<
    {
      id: string;
      name: string;
      formattedName: string;
      size: string;
      ext: string;
      blob: Blob;
    }[]
  >([]);

  React.useEffect(() => {
    (async () => {
      const updatedFiles = await Promise.all(
        files.map(async (file) => {
          const blob = await fetch(file.filePath).then((response) =>
            response.blob(),
          );

          return {
            id: file.id,
            name: file.fileName,
            formattedName: cutFileExt(file.fileName),
            size: formatFileSize(blob.size),
            ext: getFileExt(file.fileName),
            blob,
          };
        }),
      );

      setFormattedFiles(updatedFiles);
    })();
  }, [files]);

  return (
    <div className={`${styles.files} flex flex-wrap`}>
      {formattedFiles.map((file) => (
        <a
          href={URL.createObjectURL(file.blob)}
          download={file.name}
          key={file.id}
          className={`${styles.file} flex items-center gap-2`}
        >
          {getFileIcon(file.name)}
          <div className="flex flex-col gap-1">
            <div className="flex">
              <p className={styles.name}>{file.formattedName}</p>
              <span className={styles.ext}>.{file.ext}</span>
            </div>
            <span className={styles.size}>{file.size}</span>
          </div>
        </a>
      ))}
    </div>
  );
};
