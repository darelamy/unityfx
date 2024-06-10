"use client";

import React from "react";

import styles from "./FollowButton.module.scss";
import axios from "axios";
import { apiUrl } from "@/src/app/api/apiUrl";
import { IUser } from "@/types/User";
import { ClipLoader } from "react-spinners";

interface FollowButtonProps {
  user: IUser;
  authUser?: IUser;
  isUserFollowed?: boolean;
}

export const FollowButton: React.FC<FollowButtonProps> = ({
  user,
  authUser,
  isUserFollowed,
}) => {
  const [isFollowed, setIsFollowed] = React.useState(isUserFollowed);
  const [isLoading, setIsLoading] = React.useState(false);

  const toggleFollow = async () => {
    try {
      if (isFollowed) {
        setIsLoading(true);
        setIsFollowed(false);

        await axios.post(`${apiUrl}/api/users/${user.login}/unfollow`, {
          followerId: authUser?.id,
          followedId: user?.id,
        });
      } else {
        setIsLoading(true);
        setIsFollowed(true);

        await axios.post(`${apiUrl}/api/users/${user.login}/follow`, {
          followerId: authUser?.id,
          followedId: user?.id,
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      disabled={isLoading}
      className={`${styles.button} ${isFollowed ? styles.followed : ""}`}
      onClick={toggleFollow}
    >
      <div
        className="flex items-center justify-center"
        style={{ gap: isLoading ? 5 : 0 }}
      >
        {isLoading && <ClipLoader color="#a7a7a7" size={20} />}
        <span>{isFollowed ? "Отписаться" : "Подписаться"}</span>
      </div>
    </button>
  );
};
