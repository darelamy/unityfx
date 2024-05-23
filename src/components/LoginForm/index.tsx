"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginSchema } from "@/zod-schemas";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { z } from "zod";

import styles from "./LoginForm.module.scss";

export const LoginForm = () => {
  const [error, setError] = React.useState("");

  const router = useRouter();

  const form = useForm({
    mode: "onChange",
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof LoginSchema>) => {
    const response = await signIn("credentials", {
      email: values.email,
      password: values.password,
      callbackUrl: "/collabs",
      redirect: false,
    });

    if (response?.error && !response?.ok) setError(response.error);
    else window.location.assign("/");
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
            {form.formState.errors.email?.message}
          </p>
          <input
            className="authFormInput"
            type="email"
            placeholder="Почта"
            {...form.register("email")}
          />
        </div>
        <div className="formFieldContainer">
          <p className="formFieldError">
            {form.formState.errors.password?.message}
          </p>
          <input
            className="authFormInput"
            type="text"
            placeholder="Пароль"
            {...form.register("password")}
          />
        </div>
      </div>
      <div className={`${styles.loginFormRemember} flex items-center gap-2`}>
        <input type="checkbox" className={styles.loginFormRememberButton} />
        <span className={styles.loginFormRememberText}>Запомнить меня</span>
      </div>
      <div className="authFormBottom flex items-center justify-between">
        <button
          type="submit"
          className={`${styles.loginFormButton} authFormButton`}
          disabled={!form.formState.isValid || form.formState.isSubmitting}
        >
          Войти
        </button>
        <Link href="/register" className="authFormLink">
          Регистрация
        </Link>
      </div>
    </form>
  );
};
