import styles from "./Header.module.scss";
import { Logo } from "../ui/Logo";
import { SearchInput } from "../SearchInput";
import { HeaderLink } from "../HeaderLink";
import { FireIcon } from "../ui/icons/FireIcon";
import Link from "next/link";
import { DefaultAvatar } from "@/ui/DefaultAvatar";

interface HeaderProps {
  pathname?: string | null;
}

export const Header: React.FC<HeaderProps> = ({ pathname }) => {
  const isAuth = true;
  const user = { id: 1, login: "darelamy", avatarUrl: "" };

  return (
    <header className={`${styles.header} flex items-center`}>
      <div className="container">
        <div className={`${styles.inner} flex items-center justify-between`}>
          <Link href="/">
            <Logo />
          </Link>
          {!(pathname === "/register" || pathname === "/login") && (
            <>
              <SearchInput />
              <HeaderLink text="Популярное" href="/popular">
                <FireIcon />
              </HeaderLink>
              {isAuth ? (
                <Link href="/@darelamy">
                  <div className="flex items-center gap-2">
                    {user.avatarUrl ? (
                      <img src={user.avatarUrl} alt="avatar" />
                    ) : (
                      <DefaultAvatar />
                    )}
                    <span className={styles.login}>{user.login}</span>
                  </div>
                </Link>
              ) : (
                <Link href="/register" className={styles.registerBtn}>
                  Регистрация
                </Link>
              )}
            </>
          )}
        </div>
      </div>
    </header>
  );
};
