"use client";

import React, { useState } from "react";
import styles from "./BurgerMenu.module.scss";
import Link from "next/link";
import { ExitButton } from "@/components/ExitButton";
import { DefaultAvatar } from "@/ui/DefaultAvatar";
import { BurgerMenuIcon } from "@/icons/BurgerMenuIcon";
import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";

interface BurgerMenuProps {
  isAuth: boolean;
  user: any;
}

export const BurgerMenu: React.FC<BurgerMenuProps> = ({ isAuth, user }) => {
  const [isOpen, setIsOpen] = useState(false);

  const pathname = usePathname();

  const menuRef = React.useRef<HTMLDivElement>(null);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  React.useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node))
        setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuRef]);

  return (
    <div className={styles.burgerMenu} ref={menuRef}>
      <div className={styles.burgerIcon} onClick={toggleMenu}>
        <BurgerMenuIcon />
      </div>
      <AnimatePresence mode="popLayout">
        <motion.div
          className={`${styles.menu} ${isOpen ? styles.showMenu : ""}`}
          layout
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 200, scale: 1.2 }}
          transition={{ duration: 0.6, type: "spring" }}
        >
          <div>
            {isAuth ? (
              <Link
                href={`/@${user?.login}`}
                className={styles.menuItem}
                onClick={toggleMenu}
              >
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
                <Link
                  href="/register"
                  className={styles.menuItem}
                  onClick={toggleMenu}
                >
                  Регистрация
                </Link>
                <Link
                  href="/login"
                  className={styles.menuItem}
                  onClick={toggleMenu}
                >
                  Вход
                </Link>
              </div>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
