import styles from "./ProgramsListItem.module.scss";
import { AfterEffectsIcon } from "../ui/icons/AfterEffectsIcon";
import React from "react";

interface ProgramsListItemProps {
  children: React.ReactNode;
  style: React.CSSProperties;
}
export const ProgramsListItem: React.FC<ProgramsListItemProps> = ({
  children,
  style,
}) => {
  return (
    <div
      className={`${styles.programsListItem} flex justify-center items-center relative`}
    >
      <div className={styles.programsListItemBackground} style={style}></div>
      <div className="absolute">{children}</div>
    </div>
  );
};
