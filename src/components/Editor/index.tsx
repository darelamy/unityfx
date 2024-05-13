"use client";

import styles from "./Editor.module.scss";
import React from "react";
import EditorJS, { OutputBlockData } from "@editorjs/editorjs";

interface EditorProps {
  onChange: (arr: OutputBlockData[]) => void;
}

const Editor: React.FC<EditorProps> = ({ onChange }) => {
  const ref = React.useRef<EditorJS>();

  React.useEffect(() => {
    if (!ref.current) {
      const editor = new EditorJS({
        holder: "editor",
        data: {
          blocks: [],
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
