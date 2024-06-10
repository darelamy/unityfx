"use client";

import { PageTitle } from "@/components/PageTitle";
import { PostsBlock } from "@/components/PostsBlock";
import React, { useState } from "react";
import { IUser } from "@/types/User";
import styles from "./Posts.module.scss";

export const PageContent = ({ authUser }: { authUser?: IUser }) => {
  const [postType, setPostType] = useState("latest");

  const handlePostTypeChange = (type: string) => setPostType(type);

  return (
    <div className="container">
      <div className="flex flex-col items-center">
        <PageTitle title="Посты" />
        {!!authUser?.login && (
          <div className="flex items-center gap-5">
            <button
              className={`${styles.button} ${
                postType === "latest" && styles.active
              }`}
              onClick={() => handlePostTypeChange("latest")}
            >
              Последние
            </button>
            <button
              className={`${styles.button} ${
                postType === "following" && styles.active
              }`}
              onClick={() => handlePostTypeChange("following")}
            >
              Подписки
            </button>
          </div>
        )}
      </div>
      <PostsBlock authUser={authUser} type={postType} />
    </div>
  );
};
