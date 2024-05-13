import {Metadata, NextPage} from "next";
import Link from "next/link";
import React from "react";

export const metadata: Metadata = {
  title: "Регистрация",
};

const RegisterPage: NextPage = () => {
  return (
    <main>
      <div className="container flex justify-center">
        <form method="post" className="authForm">
          <h3 className="authFormTitle text-center">Регистрация</h3>
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
              name="login"
              placeholder="Логин"
            />
            <input
              className="authFormInput"
              type="text"
              name="password"
              placeholder="Пароль"
            />
            <input
              className="authFormInput"
              type="text"
              name="secondPassword"
              placeholder="Повторите пароль"
            />
          </div>
          <div className="authFormBottom flex items-center justify-between">
            <button type="submit" className="authFormButton">
              Зарегистрироваться
            </button>
            <Link href="/login" className="authFormLink">
              Войти
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
};

export default RegisterPage;
