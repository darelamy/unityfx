import styles from "./Login.module.scss"
import {Metadata, NextPage} from "next";
import Link from "next/link";
import React from "react";

export const metadata: Metadata = {
  title: "Авторизация",
};

const LoginPage: NextPage = () => {
  return (
    <main>
      <div className="container flex justify-center">
        <form method="post" className="authForm">
          <h3 className="authFormTitle text-center">Войдите в аккаунт</h3>
          <div className="flex flex-col gap-5">
            <input
              className="authFormInput"
              type="email"
              name="email"
              placeholder="Почта"
            />
            <input
              className="authFormInput"
              type="text"
              name="password"
              placeholder="Пароль"
            />
          </div>
          <div className={`${styles.loginFormRemember} flex items-center gap-2`}>
            <input type="checkbox" className={styles.loginFormRememberButton}/>
            <span className={styles.loginFormRememberText}>Запомнить меня</span>
          </div>

          <div className="authFormBottom flex items-center justify-between">
            <button type="submit" className={`${styles.loginFormButton} authFormButton`}>
              Войти
            </button>
            <Link href="/register" className="authFormLink">
              Регистрация
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
};

export default LoginPage;
