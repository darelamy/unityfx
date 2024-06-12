import styles from "./Header.module.scss";
import { Logo } from "@/ui/Logo";
import { HeaderLink } from "../HeaderLink";
import { FireIcon } from "@/icons/FireIcon";
import Link from "next/link";
import { DefaultAvatar } from "@/ui/DefaultAvatar";
import { getServerSession } from "next-auth";
import authOptions from "@/utils/auth";
import { ExitButton } from "@/components/ExitButton";
import { PostIcon } from "@/icons/PostIcon";
import { SearchIcon } from "@/icons/SearchIcon";
import { BurgerMenu } from "@/components/BurgerMenu";
import React from "react";

export const Header: React.FC = async () => {
  const session = await getServerSession(authOptions);

  const user = session?.user;

  const isAuth = !!user;

  return (
    <header className={`${styles.header} flex items-center`}>
      <div className="container">
        <div className={`${styles.inner} flex items-center justify-between`}>
          <Link href="/">
            <Logo />
          </Link>
          <div className="flex items-center gap-5">
            <HeaderLink text="Популярное" href="/popular">
              <FireIcon />
            </HeaderLink>
            <HeaderLink text="Посты" href="/posts">
              <PostIcon />
            </HeaderLink>
            <HeaderLink text="Поиск" href="/search">
              <SearchIcon />
            </HeaderLink>
          </div>
          <div className="desktop-only">
            {isAuth ? (
              <Link href={`/@${user?.login}`}>
                <div className={`${styles.avatar} flex items-center gap-2`}>
                  {user?.avatarUrl ? (
                    <img src={user.avatarUrl} alt="avatar" />
                  ) : (
                    <DefaultAvatar />
                  )}
                  <span className={styles.login}>{user?.login}</span>
                  <ExitButton />
                </div>
              </Link>
            ) : (
              <Link href="/register" className={styles.registerBtn}>
                Регистрация
              </Link>
            )}
          </div>
          <div className="mobile-only">
            <BurgerMenu isAuth={isAuth} user={user} />
          </div>
        </div>
      </div>
    </header>
  );
};
