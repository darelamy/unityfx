"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginSchema } from "@/zod-schemas";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { z } from "zod";

import styles from "./LoginForm.module.scss";

export const LoginForm = () => {
  const [error, setError] = React.useState("");

  const form = useForm({
    mode: "onChange",
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      login: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof LoginSchema>) => {
    const response = await signIn("credentials", {
      login: values.login,
      password: values.password,
      callbackUrl: "/posts",
      redirect: false,
    });

    if (response?.error && !response?.ok) setError(response.error);
    else window.location.assign("/posts");
  };

  return (
    <form
      method="post"
      className="authForm"
      onSubmit={form.handleSubmit(onSubmit)}
    >
      <h3 className="authFormTitle text-center">Войдите в аккаунт</h3>
      <div className="flex flex-col gap-5">
        {error && <p className="formFieldMainError">{error}</p>}
        <div className="formFieldContainer">
          <p className="formFieldError">
            {form.formState.errors.login?.message}
          </p>
          <input
            className="authFormInput"
            type="text"
            placeholder="Логин"
            {...form.register("login")}
            autoComplete="login"
          />
        </div>
        <div className="formFieldContainer">
          <p className="formFieldError">
            {form.formState.errors.password?.message}
          </p>
          <input
            className="authFormInput"
            type="password"
            placeholder="Пароль"
            autoComplete="current-password"
            {...form.register("password")}
          />
        </div>
      </div>
      <div className="authFormBottom flex items-center justify-between">
        <button
          type="submit"
          className={`${styles.loginFormButton} authFormButton flex items-center justify-center`}
          disabled={!form.formState.isValid || form.formState.isSubmitting}
        >
          <span>Войти</span>
        </button>
        <Link href="/register" className="authFormLink">
          Регистрация
        </Link>
      </div>
    </form>
  );
};
