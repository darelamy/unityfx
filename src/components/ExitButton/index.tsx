"use client";

import { signOut } from "next-auth/react";
import { ExitIcon } from "@/icons/ExitIcon";

import styles from "./ExitButton.module.scss";

export const ExitButton = () => {
  return (
    <div className={styles.exitButton} onClick={() => signOut()}>
      <ExitIcon />
    </div>
  );
};
