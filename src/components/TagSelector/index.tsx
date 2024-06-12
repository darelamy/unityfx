"use client";

import React from "react";
import styles from "./TagSelector.module.scss";
import { AnimatePresence, motion } from "framer-motion";

interface TagSelectorProps {
  tags: string[];
  setTags: React.Dispatch<React.SetStateAction<string[]>>;
}

export const TagSelector: React.FC<TagSelectorProps> = ({ tags, setTags }) => {
  const [currentTag, setCurrentTag] = React.useState("");
  const [shakeTag, setShakeTag] = React.useState("");

  const addTag = () => {
    const trimmedTag = currentTag.trim();

    if (trimmedTag) {
      if (tags.includes(trimmedTag)) {
        setShakeTag(trimmedTag);
        setTimeout(() => setShakeTag(""), 1000);
        return;
      }

      if (tags.length < 5 && !tags.find((tag) => tag === trimmedTag)) {
        setCurrentTag("");
        setTags([...tags, trimmedTag]);
      }
    }
  };

  const onRemoveTag = (currentTag: string) => {
    setTags([...tags.filter((tag) => tag !== currentTag)]);
  };

  return (
    <div>
      <div
        className={`${styles.formTagInputBlock} relative w-fit flex items-center justify-end`}
      >
        <input
          type="text"
          className={styles.formTagsInput}
          placeholder="Введите тег"
          value={currentTag}
          onChange={(e) => setCurrentTag(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addTag()}
        />
        <button
          className={styles.formSaveTag}
          disabled={!currentTag.trim() || tags.length === 5}
          onClick={addTag}
          type="button"
        >
          Сохранить
        </button>
      </div>
      <AnimatePresence mode="popLayout">
        <div className="flex gap-3">
          {tags.map((tag) => (
            <motion.div
              onClick={() => onRemoveTag(tag)}
              className={styles.tag}
              key={tag}
              layout
              initial={{ opacity: 0, y: -20, scale: 0.5 }}
              animate={
                shakeTag === tag
                  ? {
                      color: "#cf1f1f",
                      opacity: 1,
                      scale: 1,
                      y: 0,
                    }
                  : {
                      opacity: 1,
                      scale: 1,
                      color: "#2f2f2f",
                      y: 0,
                    }
              }
              exit={{ y: -20, transition: { duration: 0.2 } }}
              transition={{ duration: 0.4, type: "spring" }}
            >
              #{tag}
            </motion.div>
          ))}
        </div>
      </AnimatePresence>
    </div>
  );
};
