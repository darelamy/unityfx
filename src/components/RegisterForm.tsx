"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterSchema } from "@/zod-schemas";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { z } from "zod";
import axios from "axios";

export const RegisterForm = () => {
  const [error, setError] = React.useState("");

  const router = useRouter();

  const form = useForm({
    mode: "onChange",
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      email: "",
      login: "",
      password: "",
      secondPassword: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof RegisterSchema>) => {
    try {
      const { data } = await axios.post("/api/auth/register", {
        ...values,
      });

      if (data) {
        await signIn("credentials", {
          email: values.email,
          password: values.password,
          callbackUrl: "/",
        });

        router.push("/posts");
      }
    } catch (err: any) {
      setError(err.response.data);
    }
  };

  return (
    <form
      method="post"
      className="authForm"
      onSubmit={form.handleSubmit(onSubmit)}
    >
      <h3 className="authFormTitle text-center">Регистрация</h3>
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
            {form.formState.errors.login?.message}
          </p>
          <input
            className="authFormInput"
            type="text"
            placeholder="Логин"
            {...form.register("login")}
            autoComplete="username"
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
            {...form.register("password")}
            autoComplete="new-password"
          />
        </div>
        <div className="formFieldContainer">
          <p className="formFieldError">
            {form.formState.errors.secondPassword?.message}
          </p>
          <input
            className="authFormInput"
            type="password"
            placeholder="Повторите пароль"
            {...form.register("secondPassword")}
            autoComplete="new-password"
          />
        </div>
      </div>
      <div className="authFormBottom flex items-center justify-between">
        <button
          type="submit"
          className="authFormButton flex items-center justify-center"
          disabled={!form.formState.isValid || form.formState.isSubmitting}
        >
          <span>Зарегистрироваться</span>
        </button>
        <Link href="/login" className="authFormLink">
          Войти
        </Link>
      </div>
    </form>
  );
};
