"use client";

import styles from "@/src/app/create/Create.module.scss";
import Editor from "@/components/Editor";
import { TagSelector } from "@/components/TagSelector";
import { AttachIcon } from "@/icons/AttachIcon";
import ProgramSelector from "@/components/ProgramSelector";
import Link from "next/link";
import React, { useState } from "react";
import { OutputBlockData } from "@editorjs/editorjs";
import FileUploadForm from "@/components/FileUploadForm";

export const CreateForm = () => {
  const [blocks, setBlocks] = useState<OutputBlockData[]>([]);

  const onChangeEditorBlocks = (arr: OutputBlockData[]) => {
    setBlocks(arr);
  };

  return (
    <form method="post">
      <div className={styles.formElement}>
        <p className={styles.formElementTitle}>Текст поста</p>
        <Editor onChange={onChangeEditorBlocks} />
      </div>
      <div className={styles.formElement}>
        <p className={styles.formElementTitle}>Тэги</p>
        <TagSelector />
      </div>
      <div className={styles.formElement}>
        <p className={styles.formElementTitle}>Файлы</p>
        <FileUploadForm />
      </div>
      <div className={styles.formElement}>
        <p className={styles.formElementTitle}>Программы</p>
        <ProgramSelector />
      </div>
      <div className={`${styles.formBottom} flex justify-between`}>
        <button
          disabled={!blocks.length}
          className={`${styles.formBottomButton} ${styles.formBottomUploadButton} flex items-center justify-center`}
        >
          <span>Опубликовать</span>
        </button>
        <Link href="/profile">
          <button
            className={`${styles.formBottomButton} ${styles.formBottomCancelButton} flex items-center justify-center`}
          >
            <span>Отмена</span>
          </button>
        </Link>
      </div>
    </form>
  );
};
