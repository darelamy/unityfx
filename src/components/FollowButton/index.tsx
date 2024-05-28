"use client";

import React from "react";

import styles from "./FollowButton.module.scss";
import axios from "axios";
import { apiUrl } from "@/src/app/api/apiUrl";
import { IUser } from "@/types/User";

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

  const toggleFollow = async () => {
    if (isFollowed) {
      setIsFollowed(false);

      await axios.post(`${apiUrl}/api/users/${user.login}/unfollow`, {
        followerId: authUser?.id,
        followedId: user?.id,
      });
    } else {
      setIsFollowed(true);

      await axios.post(`${apiUrl}/api/users/${user.login}/follow`, {
        followerId: authUser?.id,
        followedId: user?.id,
      });
    }
  };

  return (
    <button
      className={`${styles.button} ${isFollowed ? styles.followed : ""}`}
      onClick={toggleFollow}
    >
      {isFollowed ? "Отписаться" : "Подписаться"}
    </button>
  );
};
