"use client";

import styles from "@/src/app/create/Create.module.scss";
import { TagSelector } from "@/components/TagSelector";
import { ProgramSelector } from "@/components/ProgramSelector";
import React from "react";
import { OutputBlockData } from "@editorjs/editorjs";
import { FileUploadForm, IUploadedFile } from "@/components/FileUploadForm";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import axios from "axios";
import { apiUrl } from "@/src/app/api/apiUrl";
import LoadingScreen from "@/components/LoadingScreen";

interface IProgram {
  id: number;
  name: string;
  icon: React.ReactNode;
}

export const Editor = dynamic(() => import("@/components/Editor"), {
  ssr: false,
  loading: ({ isLoading }) => <LoadingScreen isLoading={!!isLoading} />,
});

export const CreateForm = () => {
  const [blocks, setBlocks] = React.useState<OutputBlockData[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [tags, setTags] = React.useState<string[]>([]);
  const [selectedPrograms, setSelectedPrograms] = React.useState<IProgram[]>(
    []
  );
  const [files, setFiles] = React.useState<IUploadedFile[]>([]);

  const router = useRouter();

  const onChangeEditorBlocks = (arr: OutputBlockData[]) => {
    setBlocks(arr);
  };

  const onPostSubmit = async () => {
    try {
      setIsLoading(true);

      await axios.post(`${apiUrl}/api/posts`, {
        body: blocks,
        files: files.map((file) => ({
          fileName: file.file.name,
          fileUrl: file.fileUrl,
          fileType: file.file.type,
        })),
        programs: selectedPrograms.map((program) => program.name),
        tags,
      });
      router.push("/posts");
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className={styles.formElement}>
        <p className={styles.formElementTitle}>Текст поста</p>
        <Editor onChange={onChangeEditorBlocks} setIsLoading={setIsLoading} />
      </div>
      <div className={styles.formElement}>
        <p className={styles.formElementTitle}>Тэги</p>
        <TagSelector tags={tags} setTags={setTags} />
      </div>
      <div className={styles.formElement}>
        <p className={styles.formElementTitle}>Файлы</p>
        <FileUploadForm
          files={files}
          setFiles={setFiles}
          setIsLoading={setIsLoading}
        />
      </div>
      <div className={styles.formElement}>
        <p className={styles.formElementTitle}>Программы</p>
        <ProgramSelector
          selectedPrograms={selectedPrograms}
          setSelectedPrograms={setSelectedPrograms}
        />
      </div>
      <div className={`${styles.formBottom} flex justify-between flex-wrap`}>
        <button
          onClick={onPostSubmit}
          disabled={!blocks.length || isLoading}
          className={`${styles.formBottomButton} ${styles.formBottomUploadButton} flex items-center justify-center`}
        >
          <span>Опубликовать</span>
        </button>
        <button
          className={`${styles.formBottomButton} ${styles.formBottomCancelButton} flex items-center justify-center`}
          onClick={() => router.back()}
        >
          <span>Отмена</span>
        </button>
      </div>
    </div>
  );
};
