"use client";

import React, { useState } from "react";
import styles from "./BurgerMenu.module.scss";
import Link from "next/link";
import { ExitButton } from "@/components/ExitButton";
import { DefaultAvatar } from "@/ui/DefaultAvatar";
import { BurgerMenuIcon } from "@/icons/BurgerMenuIcon";

interface BurgerMenuProps {
  isAuth: boolean;
  user: any;
}

export const BurgerMenu: React.FC<BurgerMenuProps> = ({ isAuth, user }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={styles.burgerMenu}>
      <div className={styles.burgerIcon} onClick={toggleMenu}>
        <BurgerMenuIcon />
      </div>
      <div className={`${styles.menu} ${isOpen ? styles.showMenu : ""}`}>
        {isAuth ? (
          <Link href={`/@${user?.login}`} className={styles.menuItem}>
            {user?.avatarUrl ? (
              <img src={user.avatarUrl} alt="avatar" />
            ) : (
              <DefaultAvatar />
            )}
            <span>{user?.login}</span>
            <ExitButton />
          </Link>
        ) : (
          <div>
            <Link href="/register" className={styles.menuItem}>
              Регистрация
            </Link>
            <Link href="/login" className={styles.menuItem}>
              Вход
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};
