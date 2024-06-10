"use client";

import styles from "@/src/app/profile/[login]/Profile.module.scss";
import Link from "next/link";
import { DefaultAvatar } from "@/ui/DefaultAvatar";
import { FollowButton } from "@/components/FollowButton";
import React from "react";
import { IUser } from "@/types/User";
import { AnimatePresence, motion } from "framer-motion";

interface UsersListProps {
  users: IUser[];
  authUser?: IUser;
}

export const UsersList: React.FC<UsersListProps> = ({ users, authUser }) => {
  return (
    <AnimatePresence mode="popLayout">
      <motion.div
        layout
        initial={{ opacity: 0, x: -400, scale: 0.5 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        exit={{ opacity: 0, x: 200, scale: 1.2 }}
        transition={{ duration: 0.6, type: "spring" }}
      >
        <div className="flex flex-col gap-10">
          {users.map((user) => (
            <div
              key={user.id}
              className={`${styles.followPageItem} flex items-center justify-between`}
            >
              <Link href={`/@${user.login}`} className="flex items-center">
                <div className={styles.followPageAvatar}>
                  {user.avatarUrl ? (
                    <img src={user.avatarUrl} alt="avatar" />
                  ) : (
                    <DefaultAvatar />
                  )}
                </div>
                <span className={styles.followPageLogin}>{user.login}</span>
              </Link>
              {user.id !== authUser?.id && user && authUser && (
                <FollowButton
                  user={user}
                  authUser={authUser}
                  isUserFollowed={user.followedByIDs?.some(
                    (id) => id === authUser?.id
                  )}
                />
              )}
            </div>
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
