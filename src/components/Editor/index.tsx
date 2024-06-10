"use client";

import styles from "./Editor.module.scss";
import React from "react";
import EditorJS, { OutputBlockData } from "@editorjs/editorjs";
import ImageTool from "@editorjs/image";
import axios from "axios";

interface EditorProps {
  onChange: (arr: OutputBlockData[]) => void;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const Editor: React.FC<EditorProps> = ({ onChange, setIsLoading }) => {
  const ref = React.useRef<EditorJS>();

  React.useEffect(() => {
    if (!ref.current) {
      const editor = new EditorJS({
        holder: "editor",
        data: {
          blocks: [],
        },
        tools: {
          image: {
            class: ImageTool,
            config: {
              endpoints: {
                byFile: "https://api.cloudinary.com/v1_1/darelamy/image/upload",
              },
              field: "file",
              additionalRequestData: { upload_preset: "ppioffkm" },
              captionPlaceholder: "none",
              uploader: {
                async uploadByFile(file: File) {
                  setIsLoading(true);

                  try {
                    const formData: any = new FormData();

                    formData.append("file", file);
                    formData.append("upload_preset", "ppioffkm");

                    const { data } = await axios.post(
                      "https://api.cloudinary.com/v1_1/darelamy/image/upload",
                      formData
                    );

                    return {
                      success: 1,
                      file: {
                        url: data.secure_url,
                      },
                    };
                  } catch (err) {
                    console.warn(err);
                  } finally {
                    setIsLoading(false);
                  }
                },
              },
              buttonContent: "Загрузить превью",
            },
          },
        },
        placeholder: "Введите текст",
        async onChange() {
          const { blocks } = await editor.save();
          onChange(blocks);
        },
      });
      ref.current = editor;
    }
  }, []);

  React.useEffect(() => {
    setTimeout(() => {
      const editor = document.getElementById("editor");

      if (editor) editor.style.pointerEvents = "auto";
    }, 1000);
  }, []);

  return <div id="editor" className={styles.editor} />;
};

export default React.memo(Editor);
